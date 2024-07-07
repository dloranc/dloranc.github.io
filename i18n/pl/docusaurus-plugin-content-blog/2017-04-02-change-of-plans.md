---
title: Zmiana planów

tags:
    - projects
    - dsp2017
    - starcraft
image: images/posts_thumbnails/broodwar.jpg

description: "Piszę jednak bota do Starcraft: Brood War. W dzisiejszym poście wyjaśniam powody, które skłoniły mnie do tej zmiany."
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Niestety, Blizzard i DeepMind się nie wyrobili ze stworzeniem API i przesunęli termin release'u na lato tego roku, co ogłosili na forum [Battle.netu](https://us.battle.net/forums/en/sc2/topic/20753825636):

> We wanted to give you all an update on the progress of the StarCraft II API. Blizzard and DeepMind remain hard at work together defining the API and infrastructure needed to do world class research in StarCraft II. Like many research projects we’ve been learning a lot as we’ve gone along on this new endeavor. We’re eager to get a polished set of tools and documentation into the hands of researchers and developers as soon as possible. Originally we’d hoped to have the API ready by Q1 of this year but think it’s best to shift the official release back to this summer to provide a level of quality and completeness that we know you expect from us.

<!-- truncate -->

> We appreciate everyone’s patience as we continue to work on the API – our goal is to bring you the best possible tool, with thorough documentation.

Typowy Blizzard :) Podejrzewam, że API będzie wydane równo z premierą zremasterowanej pierwszej części Starcrafta, która też ma wyjść tego lata.

W związku z tym postanowiłem zabrać się za pisanie bota do Starcraft: Brood War. Nie będzie to łatwe, bo jak pisałem wcześniej, jest to środowisko raczej nieprzyjazne jeśli chodzi o machine learning. Myślałem także by samemu napisać coś starkraftopodobnego, mam już nawet coś nasmarowane w Phaserze, ale skończy się to na jakichś prostych przykładach, bo zajechałbym się mając pisać własnego RTS-a od zera. Wykorzystam ten kod do wpisów przybliżających reinforcement learning.

## BWAPI + BWMirror

Żeby napisać bota do SC:BW trzeba zainstalować Starcrafta (kto by się spodziewał) w wersji 1.16.1 i [BWAPI (The Brood War API)](https://github.com/bwapi/bwapi), a jako, że skorzystałem z tutoriala na stronie [Student StarCraft AI Tournament](http://sscaitournament.com/index.php?action=tutorial), to do tego jeszcze BWMirror, który jest javowym wrapperem na BWAPI. Sprawa jest dość prosta, pominąłem tylko zalecaną instalację Eclipse i podpiąłem projekt pod IntelliJ IDEA, bo miałem już zainstalowane to IDE. Grę odpala się przez Chaoslauncher, który zajmuje się iniekcją DLL-ek (albo czymś w tym stylu, nie znam się), które zmieniają grę albo wyciągają z niej dane.

Warto sobie także ustawić w `bwapi.ini` poniższe wartości:

```ini
auto_menu = SINGLE_PLAYER
maps = maps\sscai\*.sc?
```

Dzięki temu zaoszczędza się naprawdę sporo czasu, bo nie trzeba się przeklikiwać co chwilę przez poszczególne okna gry.

Przy okazji warto odznaczyć sobie w Chaoslauncherze W-MODE, który umożliwia odpalanie gry w oknie. Przydatne okaże się także skrót klawiszowy `CTRL+F1`, który pozwala na ograniczenie poruszania się myszki do całego okna gry. Przydaje się także możliwość dwukrotnego powiększenia okna gry i jego zawartości poprzez kliknięcie ikonki `2x` w prawym górnym rogu. Do tego też jest pewnie jakiś skrót klawiszowy, ale mnie się nie chciało go szukać.

Przykładowy bot z udostępnionej paczki wygląda następująco:

```java
import bwapi.*;
import bwta.BWTA;
import bwta.BaseLocation;

public class TestBot1 extends DefaultBWListener {

    private Mirror mirror = new Mirror();

    private Game game;

    private Player self;

    public void run() {
        mirror.getModule().setEventListener(this);
        mirror.startGame();
    }

    @Override
    public void onUnitCreate(Unit unit) {
        System.out.println("New unit discovered " + unit.getType());
    }

    @Override
    public void onStart() {
        game = mirror.getGame();
        self = game.self();

        //Use BWTA to analyze map
        //This may take a few minutes if the map is processed first time!
        System.out.println("Analyzing map...");
        BWTA.readMap();
        BWTA.analyze();
        System.out.println("Map data ready");

        int i = 0;
        for (BaseLocation baseLocation : BWTA.getBaseLocations()) {
            System.out.println("Base location #" + (++i) + ". Printing location's region polygon:");
            for (Position position : baseLocation.getRegion().getPolygon().getPoints()) {
                System.out.print(position + ", ");
            }
            System.out.println();
        }

    }

    @Override
    public void onFrame() {
        //game.setTextSize(10);
        game.drawTextScreen(10, 10, "Playing as " + self.getName() + " - " + self.getRace());

        StringBuilder units = new StringBuilder("My units:\n");

        //iterate through my units
        for (Unit myUnit : self.getUnits()) {
            units.append(myUnit.getType()).append(" ").append(myUnit.getTilePosition()).append("\n");

            //if there's enough minerals, train an SCV
            if (myUnit.getType() == UnitType.Terran_Command_Center && self.minerals() >= 50) {
                myUnit.train(UnitType.Terran_SCV);
            }

            //if it's a worker and it's idle, send it to the closest mineral patch
            if (myUnit.getType().isWorker() && myUnit.isIdle()) {
                Unit closestMineral = null;

                //find the closest mineral
                for (Unit neutralUnit : game.neutral().getUnits()) {
                    if (neutralUnit.getType().isMineralField()) {
                        if (closestMineral == null || myUnit.getDistance(neutralUnit) < myUnit.getDistance(closestMineral)) {
                            closestMineral = neutralUnit;
                        }
                    }
                }

                //if a mineral patch was found, send the worker to gather it
                if (closestMineral != null) {
                    myUnit.gather(closestMineral, false);
                }
            }
        }

        //draw my units on screen
        game.drawTextScreen(10, 25, units.toString());
    }

    public static void main(String[] args) {
        new TestBot1().run();
    }
}
```

Nie robi on wiele, wypisuje tylko listę jednostek na ekranie i kieruje wszystkie obijające się jednostki do zbierania minerałów. Całość, myślę, że jest dość zrozumiała, więc nie ma na sensu opisywanie tego kodu bardziej.

## Co dalej?

Pobawię się jeszcze trochę z Javą. Już nawet jakiegoś bota skleciłem, tworzącego jednostki i scoutującego, ale nie wykombinowałem jeszcze jak postawić jakiś budynek. Przykładowy kod z zalinkowanego wcześniej tutoriala nie działa. A to ci dowcip :) Jak już stworzę jakiegoś prostego bota robiącego 5 poola, spróbuję z machine learningiem z użyciem [TorchCrafta](https://github.com/TorchCraft/TorchCraft), albo czegoś innego, o ile znajdę, bo nie uśmiecha mi się pisanie w lua.
