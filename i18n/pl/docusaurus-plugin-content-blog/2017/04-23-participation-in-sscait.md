---
title: Uczestnictwo w SSCAIT
tags:
    - projects
    - java
    - dsp2017
    - starcraft
image: images/posts_thumbnails/sscait.jpg

description: Post o moim uczestnictwie w SSCAIT i o kolejnych poprawkach w bocie.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Do tej pory testowałem swojego bota na moim komputerze w walce z defaultowym botem stworzonym przez Blizzarda. Nadszedł czas, by sprawdzić się z twórcami innych botów. Wiem, że można zamiast standardowego bota podpiąć jakiegoś innego za pomocą **Chaoslauncher - MultiInstance** i edycji `bwapi.ini`, ale ja wolałem najpierw zobaczyć jak wygląda procedura rejestracji w [SSCAIT](http://sscaitournament.com).

<!-- truncate -->

Aby zarejestrować bota w **SSCAIT** oprócz podania różnych danych trzeba wygenerować plik `.jar` i wsadzić go do ZIP-a razem z `BWAPI.dll`, czyli DLL-ką odpowiedzialną za połączenie ze Starcraftem. Każdy bot może korzystać z innej wersji BWAPI, więc dlatego trzeba dołączyć swoją DLL-kę. Nie namyślając się wiele wygenerowałem `artifact` w IntelliJ IDEA, ale po rejestracji okazało się, że mój bot scrashował sześć razy i został zablokowany. Coś zrobiłem źle i nie bardzo wiedziałem co. Zauważyłem, jednak, że na liście wyników są linki do ściągnięcia botów. Ściągnąłem takiego, który był napisany w Javie, zmieniłem rozszerzenie z `.jar` na `.zip` i podejrzałem strukturę plików. Powinna ona wyglądać następująco:

![artifacts](/images/posts/sscait/artifacts.png "artifacts")

Konieczny jest zwłaszcza katalog `META-INF` zawierający plik `MANIFEST.MF` ze zdefiniowanym entrypointem, żeby Java wiedziała, która klasa jest tą główną z metodą `main`.

```ini
Manifest-Version: 1.0
Main-Class: dloranc.fivepoolbot.FivePoolBot
```

Trochę mi zeszło z tym, podaję to na przyszłość, bo w tutorialu na stronie SSCAIT nie było zbyt wiele na temat tworzenia działającej paczki.

Co do moich wyników w SSCAIT to po paru dniach mam 15 gier wygranych i 20 przegranych (odjąłem crashe). Moim zdaniem nieźle jak na takiego prostego bota, zwłaszcza, że na [liście wyników](http://sscaitournament.com/index.php?action=scores) wyprzedziłem 15 botów.

## Poważny bug w kodzie z tutoriala

Oglądając replaye zauważyłem, że mój bot zachowuje się nieprawidłowo. Czasami, z niewyjaśnionych powodów nie był w stanie wykryć budynków przeciwnika, co skutkowało tym, że atak szedł w niewłaściwą lokację co oznaczało przegranie gry. Po dość długim kombinowaniu udało mi się dojść, że problem tkwi w niewłaściwym zapamiętywaniu lokalizacji budynków przeciwnika. Udało mi się to nawet zwizualizować. Można to zobaczyć na poniższym gifie:

![Niepoprawne działanie](/images/posts/sscait/invalid_rescaled.gif "Niepoprawne działanie")

Bardzo ciekawe, bo skopiowałem kod tego rozwiązania z tutoriala na stronie SSCAIT i założyłem, że wszystko działa. Ale nie - niektóre budynki nie miały czerwonej kropki albo znikała ona co klatkę co objawiało się miganiem tej kropki na ekranie.

Zagadka dla was: gdzie w poniższym kodzie jest błąd?

```Java
//always loop over all currently visible enemy units (even though this set is usually empty)
for (Unit u : game.enemy().getUnits()) {
	//if this unit is in fact a building
	if (u.getType().isBuilding()) {
		//check if we have it's position in memory and add it if we don't
		if (!enemyBuildingMemory.contains(u.getPosition())) enemyBuildingMemory.add(u.getPosition());
	}
}

//loop over all the positions that we remember
for (Position p : enemyBuildingMemory) {
	// compute the TilePosition corresponding to our remembered Position p
	TilePosition tileCorrespondingToP = new TilePosition(p.getX()/32 , p.getY()/32);

	//if that tile is currently visible to us...
	if (game.isVisible(tileCorrespondingToP)) {

		//loop over all the visible enemy buildings and find out if at least
		//one of them is still at that remembered position
		boolean buildingStillThere = false;
		for (Unit u : game.enemy().getUnits()) {
			if ((u.getType().isBuilding()) && (u.getPosition() == p)) {
				buildingStillThere = true;
				break;
			}
		}

		//if there is no more any building, remove that position from our memory
		if (buildingStillThere == false) {
			enemyBuildingMemory.remove(p);
			break;
		}
	}
}
```

Zeszło mi na tym naprawdę sporo czasu, a błąd był banalny i tkwił w poniższej linijce:

```Java
if ((u.getType().isBuilding()) && (u.getPosition() == p)) {
```

Zamieniłem ją na (przy okazji pozbyłem się nadmiarowych nawiasów):

```Java
if (u.getType().isBuilding() && u.getPosition().equals(p)) {
```

No tak, w Javie jeśli chcemy porównać dwa obiekty to używamy `equals()`, bo operator `==` porównuje referencje do obiektów.

Po poprawce nic nie miga:

![Poprawne działanie](/images/posts/sscait/valid_rescaled.gif "Poprawne działanie")
