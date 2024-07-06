---
title: Torchcraft - analiza i zmiana stanu gry
tags:
    - projects
    - dsp2017
    - lua
    - starcraft
    - torch
image: images/posts_thumbnails/torchcraft_game_state_change_and_analysis.jpg
description: Post o tym jak zmienić stan gry, poprzez jego analizę i wydawanie rozkazów jednostkom.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

W ostatnim [poście o projekcie](/2017/05/21/torchcraft-podstawowy-skrypt/) opisałem jak wyglądają mapy i napisałem jak stworzyć podstawowy skrypt nawiązujący połączenie ze Starcraftem i pobierający w pętli stan gry, a właściwie to każdej kolejnej logicznej klatki gry. Nie pisałem chyba do tej pory co to jest logiczna klatka gry. Sprawa z logicznymi klatkami (logical frame) wygląda tak, że renderowanie grafiki jest niezależne od obliczeń zmieniających stan gry. Liczba klatek na sekundę nie jest stała i zależy od prędkości komputera. Stan gry natomiast jest obliczany co jakiś interwał. Jeżeli graliście w Starcrafta, to pewnie kojarzycie, że w opcjach da się ustawić prędkość gry. Zmiana prędkości skutkuje zmianą czasu pomiędzy obliczeniami klatek logicznych. To jest zasadnicza różnica, gdybyśmy mieli te stałe 30 albo 60 FPS, to zapewne sprawa zostałaby rozwiązana inaczej.

<!-- truncate -->

## Stan gry

OK, czas sprawdzić co mamy dostępne jeśli chodzi o stan gry. Najpierw przypomnę podstawowy skrypt z poprzedniej notki:

```Lua
local hostname = "192.168.56.1"
local port = 11111

local tc = require 'torchcraft'

tc.micro_battles = true

tc:init(hostname, port)
local update = tc:connect(port)

local setup = {
    tc.command(tc.set_speed, 20),
    tc.command(tc.set_gui, 1),
    tc.command(tc.set_cmd_optim, 1),
}

tc:send({table.concat(setup, ':')})

while not tc.state.game_ended do
    update = tc:receive()

    -- code here
end
tc:close()
```

W TorchCrafcie co logical frame'a następuje zmiana stanu gry. Można się do niego dobrać odwołując się do `tc.state`. Zmienna ta jest tabelą o następujących kluczach:

```Lua
--[[
    state will get its content updated from bwapi, it will have
    * map_data            : [torch.ByteTensor] 2D. 255 (-1) where not walkable
    * map_name            : [string] Name on the current map
    * img_mode            : [string] Image mode selected (can be empty, raw, compress)
    * lag_frames          : [int] number of frames from order to execution
    * frame_from_bwapi    : [int] game frame number as seen from BWAPI
    * game_ended          : [boolean] did the game end? (i.e. did the map end)
    * battle_just_ended   : [boolean] did the battle just end? (battle!=game)
    * waiting_for_restart : [boolean] are we waiting to restart a new battle?
    * battle_won          : [boolean] did we win the battle?
    * units_myself        : [table] w/ {unitIDs: unitStates} as {keys: values}
    * units_enemy         : [table] same as above, but for the enemy player
    * bullets             : [table] table with all bullets (position and type)
    * screen_position     : [table] Position of screen {x, y} in pixels. {0, 0} is top-left
]]
```

I nie tylko, jest jeszcze `units_neutral` (zawiera zwierzątka, minerały i gazy) i pewnie jeszcze parę innych, ale tego musiałbym szukać w kodzie TorchCrafta. Ten powyższy komentarz wziąłem z kodu TorchCrafta.

Jak widać, w podstawowym skrypcie wykorzystywany już jest `game_ended`.

Interesującą strukturą jest `map_data`. Jest to `ByteTensor` z Torcha i zawiera on informacje o mapie, takie jak na przykład miejsca, do których jednostki nie mogą dojść i tym podobne. Bardzo przydatne. Dla *m5v5_c_far.scm* rozmiar mapy wynosi 256x256 i można go uzyskać poprzez:

```Lua
local map = tc.state.map_data
print(map:size())
```

Dla nas najbardziej interesujące będą `units_myself`, `units_enemy` i `bullets`. Sprawdźmy co zawiera `units_myself`:

```Lua
print(tc.state.units_myself)

{
  21 :
    {
      lifted : false
      pixel_size_x : 17
      detected : true
      gwcd : 0
      idle : false
      awrange : 16
      order : 6
      type : 0
      position :
        {
          1 : 83
          2 : 141
        }
      targetpos :
        {
          1 : 60
          2 : 150
        }
      energy : 0
      size : 1
      resource : 0
      gwdmgtype : 3
      pixel_y : 1128
      shieldArmor : 0
      awattack : 6
      playerId : 0
      visible : 1
      velocity :
        {
          1 : 0
          2 : 0
        }
      hp : 40
      awdmgtype : 3
      orders :
        {
          1 :
            {
              first_frame : 5
              target : -1
              type : 6
              targetpos :
                {
                  1 : 60
                  2 : 150
                }
            }
        }
      max_hp : 40
      target : -1
      armor : 0
      max_shield : 0
      maxcd : 15
      gwattack : 6
      shield : 0
      awcd : 0
      pixel_x : 664
      gwrange : 16
      pixel_size_y : 20
    }

    -- ...
}
```

Naprawdę sporo danych o jednostce.

## Komendy

Przyszedł czas na wydawanie rozkazów jednostkom. Przeróbmy pętlę while:

```Lua
local give_orders = false

while not tc.state.game_ended do
    update = tc:receive()

    local actions = {}

    if give_orders == false then
        for uid, unit in pairs(tc.state.units_myself) do
            table.insert(actions,
                tc.command(
                    tc.command_unit_protected,
                    uid,
                    tc.cmd.Attack_Move,
                    -1,
                    103,
                    141
                )
            )
        end

        give_orders = true
    end

    tc:send({table.concat(actions, ':')})

    if tc.state.battle_just_ended or tc.state.waiting_for_restart then
        give_orders = false
    end
end
```

Powyższy kod na samym początku bitwy wydaje rozkaz ataku miejsca, w którym znajdują się jednostki wroga. Aby wydać komendy w danym frame'u tworzymy tabelę `actions`:

```Lua
local actions = {}
```

Następnie iterujemy po wszystkich naszych jednostkach:

```Lua
for uid, unit in pairs(tc.state.units_myself) do
	-- ...
end
```

Funkcja `pairs` zwraca klucze i wartości osobno. Są one przypisywane do zmiennych `uid`, `unit`.

Rozkazy tworzymy poprzez wywołanie `tc.command` z określonymi argumentami:

```Lua
tc.command(
    tc.command_unit_protected,
    uid,
    tc.cmd.Attack_Move,
    -1,
    103,
    141
)
```

Pierwszy argument nie mam pojęcia co robi, drugi to id jednostki (każde jest unikalne), trzeci to komenda, czwarty - nie mam pojęcia, piąty i szósty to pozycja x i y. Komendy wstawiamy do tabeli `actions` poprzez użycie `table.insert`.

Czas na wysłanie komend do Starcrafta:

```Lua
tc:send({table.concat(actions, ':')})
```

Powyższ kod scala tablicę do postaci stringa, w którym każda komenda jest oddzielona dwukropkiem i wysyła.

W powyższym przykładzie występuje także zmienna `give_orders`. Dodałem ją, by uniknąć spamowania komendami. Spam powoduje wolne działanie Starcrafta i do tego jednostki zamiast atakować to co jest po drodze idą do danej lokacji nie zważając na nic.

## Podsumowanie

Sprawa nie jest trudna, zeszło mi jedynie trochę czasu na zrozumienie czemu mi nie działa wydawanie rozkazu przemieszczania się. Okazało się, że trzeba dodać to magiczne `-1` przed pozycjami x i y. Działanie zaprezentowanego kodu można zobaczyć na poniższym gifie.

![TorchCraft - simple battle](/images/posts/torchcraft_game_state_change_and_analysis/torchcraft_battle.gif)

W następnym poście postaram się albo opisać więcej rzeczy lub w końcu skorzystać z uczenia maszynowego (Q-learning). Zobaczmy jak będzie z czasem.
