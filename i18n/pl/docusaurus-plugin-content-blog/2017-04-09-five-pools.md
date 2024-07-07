---
title: Pięć basenów

tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
image: images/posts_thumbnails/5_pool.jpg

description: "Dalszy ciąg zabaw z pisaniem bota do Starcrafta: Brood War. Stworzyłem prostego bota w Javie potrafiącego zrobić 5 poola."
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Od ostatniego postu o projekcie, siedziałem dość sporo czasu nad botem próbując napisać coś co wykonuje jakąś prostą strategię. Po instalacji BWAPI bot uruchamia się i gra ze standardowym botem zawartym w grze. Jako że znałem już od lat defaultowego bota i jego słabości postanowiłem, że mój bot będzie wykonywał prostą strategię zwaną jako 5 pool z pewną modyfikacją.

<!-- truncate -->

Wygląda ona następująco:

1. Jeśli jest 50 minerałów, to stwórz dronę.
2. Weź stworzoną dronę i wyślij ją do potencjalnej bazy przeciwnika. Mapy na których boty grają w [SSCAIT](http://sscaitournament.com) mają od dwóch do maksymalnie czterech możliwych lokacji w których mogą być bazy, więc drona może być posłana do jednej, dwóch lub trzech lokacji w zależności od mapy.
3. Jeśli jest 200 minerałów i pięć dron to stwórz spawning poola.
4. Jeśli drona napotka bazę przeciwnika, niech zaatakuje najbliższy budynek po czym niech ucieknie z powrotem do swojej bazy zbierać minerały.
5. Jeśli jest już spawning pool zbudowany, niech tworzą się zerglingi (i w razie czego overlordy jak nie da się robić zerglingów, bo został osiągnięty limit jednostek) i niech atakują bazę przeciwnika.

Jak widać, strategia jest bardzo prosta. W punkcie czwartym wykorzystuję wyjątkowo głupie zachowanie standardowego starcraftowego bota. Jeśli jego baza została zaatakowana, to bierze wszystkie jednostki i próbuje zniszczyć tę która zaatakowała. Jeśli zaczniemy tą jednostką uciekać, to bot goni ją aż do naszej bazy. Takie zachowanie ma gigantyczny wpływ na ekonomię bota, bo przez dość długi czas nie wydobywa, a to oznacza przegraną grę. Takie zagranie nie jest konieczne, bo bez tego można bez problemu wygrać z botem za pomocą 5 poola, ale ja się lubię znęcać nad sztuczną inteligencją :)

## Kod

Kod tego bota umieściłem w [osobnym repozytorium](https://github.com/dloranc/five-pool-bot). Nie chcę śmiecić w konkursowym, bo nie będę pisał w Javie.

Tym razem opiszę ważniejsze fragmenty kodu:

```Java
@Override
public void onStart() {
	// ...

    isScouting = false;
    isScoutingIdle = false;
    isSpawningPool = false;
    scoutDrone = null;
    buildDrone = null;
    hatchery = null;
    playerStartLocation = null;
    possibleEnemyBaseLocations = null;
    baseToScout = null;
    enemyBase = null;
    enemyBuildings = new EnemyBuildings();

    // ...
}
```

Powyższy fragment zapobiega różnym bugom. Jeśli nie ustawimy pól klasy przy starcie każdej rozgrywki, to może dojść do nieprawidłowego zachowania bota w kolejnej rozgrywce, bo instancja bota nie jest tworzona od nowa, tylko jest wykorzystywana cały czas, a przed startem rozgrywki wywoływana jest funkcja `onStart`. Miałem na przykład problemy z tym, że drona wybrana do budowania nie mogła zbudować **spawning poola**, bo jej po prostu nie było. `buildDrone` zawierało referencję do obiektu z poprzedniej rozgrywki.

Najważniejsza jest jednak funkcja `onFrame` wywoływana co klatkę:

```Java
@Override
public void onFrame() {
    float supplyUsed = self.supplyUsed() / 2;
    float supplyTotal = self.supplyTotal() / 2;
    int dronesCount = getDronesCount();

    enemyBuildings.update(game);

    // ...

    for (Unit myUnit : self.getUnits()) {
        if (myUnit.getType() == UnitType.Zerg_Hatchery) {
            if (supplyTotal - supplyUsed <= 1) {
                if (self.minerals() >= 100) {
                    myUnit.train(UnitType.Zerg_Overlord);
                }
            } else {
                if (supplyUsed < 5) {
                    if (self.minerals() >= 50) {
                        myUnit.train(UnitType.Zerg_Drone);
                    }
                } else {
                    if (self.minerals() >= 50) {
                        myUnit.train(UnitType.Zerg_Zergling);
                    }
                }
            }
        }

        if ((myUnit.getType().isWorker() && myUnit.isIdle())) {
            gatherMinerals(myUnit);
        }

        if (myUnit.getType() == UnitType.Zerg_Zergling && myUnit.isIdle()) {
            attack(myUnit);
        }
    }

    scouting(dronesCount);

    if (dronesCount >= 5 && !isSpawningPool && self.minerals() >= 200) {
        buildSpawningPool();
    }
}
```

Najpierw inicjalizowane są trzy pomocnicze zmienne: `supplyUsed`, `supplyTotal` i `dronesCount`. Pierwsze dwie są właściwie zbędne. Stworzyłem je bo BWAPI zwraca wszystkie wartości supply zajmowane przez jednostki pomnożone przez dwa ze względu na to, że jeden zergling zajmuje 0.5 supply. Ja jestem przyzwyczajony do wartości z gry, więc łatwiej mi się pracowało z pomocą tych zmiennych. Natomiast `dronesCount` to liczba dron. Jest ona wykorzystywana, by określić kiedy zbudować **spawning poola**.

Cała funkcja `onFrame` zawiera sprawdzanie i aktualizację zbioru (HashSet) budynków przeciwnika, kolejność budowania i produkcji jednostek, rozkazy dla jednostek. Niechlujne to wszystko strasznie, ale napiszę tylko, że to wyglądało gorzej, więc cieszcie się, że nie musicie czytać pierwotnej sieki, którą stworzyłem :)

Co by tu jeszcze opisać, by post się nie rozrósł za bardzo? Może jak wygląda atak:

```Java
private void attack(Unit myUnit) {
    HashSet<Position> enemyBuildingPositions = enemyBuildings.getBuildings();

    if (!enemyBuildingPositions.isEmpty()) {
        Position enemyBuildingPosition = enemyBuildingPositions.iterator().next();
        myUnit.attack(enemyBuildingPosition);
    } else {
        if (enemyBase != null) {
            myUnit.attack(enemyBase.getPosition());
        } else {
            ThreadLocalRandom random = ThreadLocalRandom.current();

            Position randomPosition = new Position(
                    random.nextInt(game.mapWidth() * 32),
                    random.nextInt(game.mapHeight() * 32)
            );

            if (myUnit.canAttack(randomPosition)) {
                myUnit.attack(randomPosition);
            }
        }
    }
}
```

Sprawa jest prosta, jeśli drona scoutująca wykryła jakieś wrogie budynki (czyli bazę przeciwnika) to zerglingi je atakują. Jeśli nie, to atakowana jest pozycja w której znajdować się powinna baza przeciwnika. Jeśli jej nie znamy, to zerglingi biegają po mapie szukając wroga i jego budynków. Ta liczba 32 przy losowaniu pozycji to rozmiar jednego Tile'a.

## Podsumowanie

Bot działa całkiem dobrze, trochę czasem głupieje na dużych mapach jak drona scoutująca nie znajdzie przeciwnika w pierwszych dwóch możliwych lokacjach, ale to nie jest problem, bo i tak wygrywa. Problem sprawia także mapa **Electro Circuit**, na której w pewnych miejscach są **Psi Disruptery**. Wybitnie słaby pathfinding Starcrafta sprawia, że część jednostek zawiesza się na na tych budynkach próbując przejść dalej. Żeby to obejść musiałbym chyba napisać własny pathfinding :)

Można poprawić parę rzeczy:

- Zbieranie minerałów można zoptymalizować zgodnie z tym tematem na [TeamLiquid](http://www.teamliquid.net/forum/brood-war/484849-improving-mineral-gathering-rate-in-brood-war).
- <strike>Scoutować powinna stworzona drona, a nie wylosowana spośród tych początkowych.</strike>
- <strike>Jeśli drona przeznaczona do budowania ma zamiar budować, to przed budowaniem powinna odnieść minerały jeśli jakieś zebrała. Teraz jest tak, że jeśli jakieś miała to są one tracone.</strike>
- <strike>Scout może być bardziej optymalny, drona powinna chodzić do baz które są najbliżej.</strike>
- <strike>Czasami jak drona jedzie do ostatniej bazy na dużej mapie, a wyprodukowane zostają zerglingi, to wtedy poruszają się one w losowe miejsca na mapie, bo nie wiedzą gdzie jest baza przeciwnika. Można to poprawić wysyłając je do bazy do której zmierza drona, bo wiadomo już wtedy, że jest to ta właściwa baza.</strike>
- Zerglingi mogą lepiej walczyć, można zastosować priorytety, co atakować w pierwszej kolejności. Przydatne byłoby także wycofywanie ciężko rannych jednostek, by się zregenerowały.
- <strike>Jeśli baza i budynki naokoło są zniszczone, a nie zostaje zakończona gra to znaczy, że gdzieś na mapie jest jakiś budynek, który został do zniszczenia. Zerglingi nawet nie szukają losowo tylko się gromadzą w jednym miejscu.</strike>
- Ogólnie, przydałoby się napisać jakąś klasę umożliwiającą wydawanie rozkazów jednostkom i anulowanie ich, gdy zajdą jakieś okoliczności.

Sam kod też nie jest wysokich lotów. Aż prosi się o uprzątnięcie tego bajzlu. Przydałoby się wydzielić większość kodu do osobnych klas i stworzyć jakąś logikę realizowania build orderu.

Bota w akcji można obejrzeć tutaj:

<iframe src="https://www.youtube.com/embed/xvI2EuLPg6o" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## Co dalej?

Ogarnąłem mniej więcej jak się pisze bota i poznałem niektóre problemy z tym związane. Teraz można się w końcu wziąć za **reinforcement learning**. Myślę, że uczenie maszynowe można by zastosować w tym bocie by zerglingi mogły lepiej walczyć. Ale o tym w następnych postach.
