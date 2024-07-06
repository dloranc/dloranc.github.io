---
title: Poznawanie BWAPI
tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
    - java
image: images/posts_thumbnails/learning_bwapi.jpg
description: Dopieszczamy bota, uczymy się BWAPI, jego funkcji do debugowania i innych przydatnych rzeczy.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Ten tydzień spędziłem dopieszczając mojego bota do Starcrafta. Nie chciało mi się jeszcze brać za reinforcement learning, bo wolałem spędzić czas na poznawaniu BWAPI. Kod jest do przeglądnięcia tutaj, w moim repozytorium [dloranc/five-pool-bot](https://github.com/dloranc/five-pool-bot).

<!-- truncate -->

## Poprawki

W poprzednim poście napisałem listę rzeczy do zrobienia. Cześć z nich udało się wykonać (są to te skreślone poniżej):

- Zbieranie minerałów można zoptymalizować zgodnie z tym tematem na [TeamLiquid](http://www.teamliquid.net/forum/brood-war/484849-improving-mineral-gathering-rate-in-brood-war).
- <strike>Scoutować powinna stworzona drona, a nie wylosowana spośród tych początkowych.</strike>
- <strike>Jeśli drona przeznaczona do budowania ma zamiar budować, to przed budowaniem powinna odnieść minerały jeśli jakieś zebrała. Teraz jest tak, że jeśli jakieś miała to są one tracone.</strike>
- <strike>Scout może być bardziej optymalny, drona powinna chodzić do baz które są najbliżej.</strike>
- <strike>Czasami jak drona jedzie do ostatniej bazy na dużej mapie, a wyprodukowane zostają zerglingi, to wtedy poruszają się one w losowe miejsca na mapie, bo nie wiedzą gdzie jest baza przeciwnika. Można to poprawić wysyłając je do bazy do której zmierza drona, bo wiadomo już wtedy, że jest to ta właściwa baza.</strike>
- Zerglingi mogą lepiej walczyć, można zastosować priorytety, co atakować w pierwszej kolejności. Przydatne byłoby także wycofywanie ciężko rannych jednostek, by się zregenerowały.
- <strike>Jeśli baza i budynki naokoło są zniszczone, a nie zostaje zakończona gra to znaczy, że gdzieś na mapie jest jakiś budynek, który został do zniszczenia. Zerglingi nawet nie szukają losowo tylko się gromadzą w jednym miejscu.</strike>
- Ogólnie, przydałoby się napisać jakąś klasę umożliwiającą wydawanie rozkazów jednostkom i anulowanie ich, gdy zajdą jakieś okoliczności.

Ciekawie miałem zwłaszcza z odnoszeniem minerałów przez dronę przed zbudowaniem **Spawning Poola**. Przykładowa logika powinna wyglądać mniej więcej tak:

```Java
if (buildDrone.isCarryingMinerals()) {
	buildDrone.returnCargo();
} else {
	// ...

	buildDrone.build(UnitType.Zerg_Spawning_Pool, buildPosition);
}
```

Ale okazało się, że to czasami nie działa. Patrząc w [dokumentację BWAPI](https://bwapi.github.io/class_b_w_a_p_i_1_1_unitset.html#a0b24b5f25b609169c0fafbe70d2f60aa) funkcji `returnCargo` zauważyłem taką uwagę:

> There is a small chance for a command to fail after it has been passed to Broodwar.

Ciekawe jest to, że w tym miejscu dokumentacji ta uwaga jest pod prawie każdą funkcją. Ciekawe z czego wynika niemożność wykonania danej akcji? I czy na pewno nie było jakiegoś problemu z moim kodem?

Rozwiązałem ten problem inaczej, ale nie do końca optymalnie. Możliwe jest wystąpienie takiej sytuacji, że wszystkie drony będą miały minerały i algorytm budujący musi czekać na to, aż jakaś odniesie minerały do bazy. Nie wiem, czy taka mała strata czasu może być czasem kluczowa do wygrania rozgrywki. Wydaje mi się, że nie, ale lubię mieć wszystko na 100%.

```Java
Unit buildDrone = null;

for (Unit myUnit : self.getUnits()) {
    if (myUnit.getType() == UnitType.Zerg_Drone) {
        if (!myUnit.isCarryingMinerals() && myUnit.getID() != scoutDrone.getID()) {
            buildDrone = myUnit;
            break;
        }
    }
}
```

## Rysowanie pomocniczych figur

**BWAPI** dostarcza [kilkanaście fajnych metod do rysowania](https://bwapi.github.io/class_b_w_a_p_i_1_1_game.html) punktów, linii, kwadratów, okręgów, elips, trójkątów, a także do wypisywania tekstu na ekranie.

Każda metoda zaczyna się od słowa `draw` i wywoływana jest na obiekcie typu `Game`. Po słowie `draw` dajemy co chcemy narysować (`Text`, `Box`, `Triangle`, `Dot`, `Circle`, `Ellipse`, `Line`), po którym możemy dać jeszcze słówko wskazujące na to jak **BWAPI** ma interpretować przesłane koordynaty. Jeśli chcemy narysować na mapie kwadrat to wywołamy metodę `drawBoxMap`, jeśli chcemy narysować na ekranie to wywołujemy `drawBoxScreen`. Pozycja (0, 0) będzie wtedy oznaczała lewy górny róg. Możemy także użyć `drawBoxMouse`, wtedy pozycja (0, 0) będzie oznaczała narysowanie kwadratu tam gdzie jest kursor.

```cpp
drawBox(CoordinateType::Enum ctype, int left, int top, int right, int bottom, Color color, bool isSolid=false)
drawBoxMap(Position leftTop, Position rightBottom, Color color, bool isSolid=false)
drawBoxMouse(Position leftTop, Position rightBottom, Color color, bool isSolid=false)
drawBoxScreen(Position leftTop, Position rightBottom, Color color, bool isSolid=false)
// ...
drawLineMap(Position a, Position b, Color color)
drawLineMouse(Position a, Position b, Color color)
drawLineScreen(Position a, Position b, Color color)
```

Wykorzystałem to do graficznej wizualizacji rozkazów (na czerwono na screenie poniżej), które wykonują jednostki. Zaznaczyłem na mapie chokepointy, czyli wąskie miejsca, które są ważne ze względów strategicznych (żółty kolor). Narysowałem także strefy, po których nie mogą się poruszać jednostki lądowe (na szaro). Pytanie tylko tylko dlaczego przy tym musiałem wszystkie pozycje punktów wielokątów przemnożyć przez 8? Za pomocą okręgu oznaczyłem też miejsce, w którym jest baza przeciwnika (na screenie w nagłówku). Przydało mi się to przy debugowaniu scoutowania.

![Linie pomocnicze](/images/posts/learning_bwapi/01.jpg "Linie pomocnicze")

## Inne przydatne rzeczy

Na [starcraftai.com](http://www.starcraftai.com/wiki/Increasing_StarCraft_Speed) odkryłem dwa sposoby na przyspieszenie gry. Pierwszym sposobem jest całkowite wyłączenie silnika odpowiadającego za dźwięk, bo normalnie nawet jeśli damy głośność na zero, to będą wywoływane funkcje odtwarzające dźwięk i muzykę. Wyłączenie silnika sprawia, że te funkcje nie będą uruchamiane. Prawdę mówiąc, nie zauważyłem zbytniego przyspieszenia gry, ale dla spokoju wyłączyłem.

```ini
[starcraft]
; Game sound engine = ON | OFF
sound = OFF
```

Druga fajna rzecz, to możliwość wyłączenia renderowania grafiki, gdy rozpocznie się mecz. No, prawie, bo z tego co widziałem to czasem zrenderuje jakąś klatkę.

```Java
game.setGUI(false);
```

Odkryłem, że jest także możliwość uruchomienia Starcrafta w trybie **headless** (bez renderowania żadnej grafiki) w linii komend. Można tego dokonać za pomocą projektu [tscmoo/bwheadless](https://github.com/tscmoo/bwheadless). Udało mi się to skompilować, ale na razie tego nie testowałem. Na pewno się przyda. Szkoda tylko, że ten projekt nie posiada chociażby **README.md**.

## Co dalej?

Teraz się wezmę w końcu za reinforcement learning. Mam takie przypuszczenie, że da się wygrać większość gier nawet z botami, które mają dobre micro, tylko i wyłącznie za pomocą wczesnego ataku Zerglingów. Przy perfekcyjnym micro zwłaszcza Protoss może mieć spore problemy, gdyż jego podstawowa jednostka jaką jest **Zealot** jest bardzo wolna i nie jest w stanie nadążyć za Zergligami. Wystarczy, że mój bot skupi się na budynkach unikając przeciwnika jak się da, a gra będzie wygrana. To jest oczywiście moja hipoteza, zobaczymy jak to wyjdzie w praniu.

Jeszcze pozostaje kwestia czego użyć. Próbowałem TorchCrafta, ale nie rozwiązałem problemów z nim związanych. TorchCraft wykorzystuje język **Lua**, a ja bym chciał sprawdzić mojego bota w [SSCAIT](http://sscaitournament.com), a tam można zgłaszać tylko boty w Javie i C++. Może spiąć to co już napisałem z [deeplearning4j](https://deeplearning4j.org/)? Chyba tak zrobię, chcę sprawdzić ile mój bot będzie wart.
