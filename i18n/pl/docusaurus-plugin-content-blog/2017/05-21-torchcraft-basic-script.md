---
title: TorchCraft - podstawowy skrypt
tags:
    - projects
    - dsp2017
    - lua
    - starcraft
    - torch
image: images/posts_thumbnails/torchcraft_basic_script.jpg

description: Post o podstawach pracy z TorchCraftem. Dowiesz się jak wyglądają mapy w TorchCrafcie i jak stworzyć podstawowy skrypt zawierający minimum funkcjonalności.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Miałem w tym tygodniu pisać o samym Torchu i o tym jak tworzyć w nim sieci neuronowe, ale zdecydowałem, że zajmę się samymi podstawami samego TorchCrafta i jego interakcji ze Starcraftem. TorchCraft, niestety, ma słabą dokumentację i poza opisem instalacji praktycznie wszystko trzeba rozkminiać na bazie przykładów z katalogu `examples`.

<!-- truncate -->

## Mapy

Zacznijmy od tego, że TorchCrafta można uruchomić w dwóch trybach: micro i w normalnym. W normalnym trybie można grać na zwykłych mapach do multi. Tutaj nie ma żadnych niespodzianek. Mapy do micro nie zawierają budynków i walczą na nich dwie grupy jednostek. Do tego trybu mapy muszą być specjalnie przygotowane. Z TorchCraftem dostarczane są cztery mapy: `dragoons_zealots.scm`, `m5v5_c_far.scm`, `sp_dragoons_zealots.scm`, `sp_m5v5_c_far.scm`. Są to tak naprawdę dwie mapy w dwóch wersjach każda. Nie mam pojęcia jaka jest różnica, te z przedrostkiem `sp_` może mają jakiś związek z single playerem?

Mapy micro zawierają rozmieszczone równomiernie specjalne, niewidzialne jednostki odkrywające cześć mapy (tak zwane Map Revealery), a także lokacje startowe (Start Location), czyli punkty, w których pojawiają się jednostki.

![dragoons_zealots.scm](/images/posts/torchcraft_basic_script/01_dragoons_zealots.png)

Żeby te jednostki się pojawiły potrzebne są tak zwane triggery. Tworzy się je w edytorze map w specjalnym panelu. Triggery pozwalają na wiele różnych rzeczy np. umieszczanie jednostek na mapie, sterowanie jednostkami, wypisywanie tekstu na ekranie, ogólnie - pozwalają na sterowanie grą. Triggery zawierają dwie rzeczy: `conditions` - czyli warunki dla których trigger jest uruchamiany, a także `actions` - czyli akcje uruchamiane w ramach danego triggera. Można jeszcze ustawić osobno, dla jakiego gracza trigger jest uruchamiany.

Zobaczmy na nasze mapy micro:

![dragoons_zealots.scm](/images/posts/torchcraft_basic_script/02_dragoons_zealots.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/03_m5v5_c_far.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/04_m5v5_c_far.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/05_m5v5_c_far.png)

Widzimy, że triggery na samym początku każdej rozgrywki tworzą po kilka jednostek dla obu graczy, a także, jeśli zachodzi potrzeba następuje wysłanie jednostek do ataku.

Ok, tyle jeśli chodzi o mapy. Czas zająć się kodem.

## Kod

Na początek napiszmy minimalny działający przykład:


```Lua
local hostname = "192.168.56.1"
local port = 11111

local tc = require 'torchcraft'

tc.micro_battles = true

tc:init(hostname, port)
local update = tc:connect(port)

while not tc.state.game_ended do
    update = tc:receive()

    -- code here
end

tc:close()
```

Przenalizujmy ten przykład:

Pierwsze dwie linijki to host i port potrzebny do połączenia z hostem (Windows ze Starcraftem):

```Lua
local hostname = "192.168.56.1"
local port = 11111
```

Następnie ładujemy bibliotekę TorchCraft:

```Lua
local tc = require 'torchcraft'
```

Przełączamy TorchCrafta w tryb micro:

```Lua
tc.micro_battles = true
```

Odpalamy połączenie:

```Lua
tc:init(hostname, port)
local update = tc:connect(port)
```

Następnie następuje pętla, w której możemy wydawać rozkazy jednostkom. W tym przykładzie nie zdefiniowaliśmy warunków zakończenia pętli, więc rozegrane zostanie nieskończenie wiele bitew:

```Lua
while not tc.state.game_ended do
    update = tc:receive()

    -- code here
end
```

Na samym końcu zamykamy połączenie:

```Lua
tc:close()
```

Jak widać, sprawa jest bardzo prosta. Pobawmy się jednak jeszcze trochę. Dodajmy konfigurację nad pętlą `while`:

```Lua
local setup = {
    tc.command(tc.set_speed, 20),
    tc.command(tc.set_gui, 1),
    tc.command(tc.set_cmd_optim, 1),
}

tc:send({table.concat(setup, ':')})
```

Są to trzy komendy. `set_speed` odpowiada za prędkość gry, jeśli damy zero to gra będzie bardzo szybka, bo czas między wykonaniem logicznych klatek (logical frames) będzie praktycznie zerowy. `set_gui` ustawione na `1` oznacza, że można zobaczyć przebieg akcji. Natomiast `set_cmd_optim` to optymalizacja komend stosowana przez BWAPI, jeśli jest ustawiona BWAPI stara się zredukować liczbę akcji poprzez grupowanie i wykonywanie podobnych rozkazów. Można ustawić wartości od 0 do 4 ([dokumentacja](https://bwapi.github.io/class_b_w_a_p_i_1_1_game.html#a2e44b952a0a55416da1628237bbc82ea)).

Zobaczmy jeszcze co jest wysyłane do TorchCrafta:

```Lua
print({table.concat(setup, ':')})
```

Otrzymamy:

```Lua
{
  1 : "6,20:8,1:10,1"
}
```

Widzimy, że komendy są oddzielone dwukropkami, a liczbowe identyfikatory komend są oddzielone od wartości przecinkami.

## Podsumowanie

Dobra, to na razie tyle. Niestety, dokumentacja TorchCrafta praktycznie nie istnieje, więc wiele nie zdziałałem. Nie mogłem na razie na przykład wykombinować jak wydać jednostce rozkaz przemieszczenia się do innego miejsca bez atakowania niczego po drodze. Wiedzę trzeba będzie zdobyć poprzez czytanie kodu i ciągłe testowanie co działa, a co nie. Nie będzie lekko :)
