---
title: TorchCraft - podstawy Lua
tags:
    - Projekty
    - DSP2017
    - lua
    - starcraft
image: torchcraft_lua_basics.png
description: Ogarnąłem instalację TorchCrafta. Wziąłem się za pisanie kodu w Lua, a ten post jest dumpem moich notatek utworzonych w trakcie nauki tego języka.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Ostatnio nie starczyło mi czasu by dokończyć instalację TorchCrafta. Już po napisaniu [poprzedniego posta](/2017/04/30/instalacja-torchcrafta), przypomniałem sobie, że w NTFS jest coś takiego jak "junction point", które jest czymś w rodzaju symlinków w Windowsie. Jeśli BWEnv.exe wymaga Starcrafta ze ścieżką *C:\Starcraft*, to wystarczy ściągnąć [Junction](https://technet.microsoft.com/pl-pl/sysinternals/bb896768), przenieść do *C:\Windows\System32* i wykonać w konsoli: **junction c:\Starcraft d:\Games\Starcraft**. U mnie zadziałało. No, dobra, nie do końca zadziałało, bo gra uruchomiła się na pełnym ekranie (w configu jest, że ma być w oknie), coś tam się wykonywało, ale po drugiej próbie uruchomienia BWEnv.exe już nie chciało. Lepszą opcją okazało się użycie BWEnv.dll i odpalanie gry przez Chaoslauchera.

## Lua - podstawy
Ok, TorchCraft do działania wykorzystuje Torcha (kto by pomyślał?). Torch jest biblioteką do machine learningu bazującą na języku skryptowym Lua. Jako, że nie znałem wcześniej Lua, to nadszedł czas by ogarnąć chociaż podstawy. Język najlepiej zrozumieć poprzez czytanie dokumentacji i pisanie kodu sprawdzającego poszczególne części języka. Skrypty Lua mają rozszerzenie `.lua` i są uruchamiane przez `lua <nazwa_skryptu`. OK, czas na przykłady:

### Zmienne deklaruje i inicjalizuje się tak:
```lua
j = 10         -- global variable
a = true
b = nil
local i = 1    -- local variable
```
`local` pozwala na zadeklarowanie zmiennej lokalnej, czyli ograniczonej do zasięgu bloku. Więcej o tym można poczytać w [dokumentacji](https://www.lua.org/pil/4.2.html).


### Wyświetlanie na ekranie
```lua
a = 10
b = nil     -- null value
s = "hello"
print(a, b) --> 10   nil
print(s)    --> hello
```

### Wczytywanie danych od użytkownika
```lua
line = io.read()
```

### Komentarze (nietypowa składnia)
```lua
-- comment

--[[
block comment
]]
```

### Konkatenacja stringów
```lua
print("Hello " .. "World")  --> Hello World
print(0 .. 1)               --> 01

a = "Hello"
print(a .. " World")   --> Hello World
print(a)               --> Hello
```
Widać także, że stringi są *immutable*.

### Tabele
W Lua jest coś takiego jak tabele, przypominają one tablice asocjacyjne znane z PHP. Indeksować w nich można za pomocą dowolnej wartości (poza reserved words takimi jak nil, while i tak dalej.

```lua
a = {1, 2, 3, 4, 5}
print(a)

--[[
{
  1 : 1
  2 : 2
  3 : 3
  4 : 4
  5 : 5
}
]]

print(a[0]) --> nil
print(a[1]) --> 1

table.insert(a, 6)
print(a)

--[[
{
  1 : 1
  2 : 2
  3 : 3
  4 : 4
  5 : 5
  6 : 6
}
]]

-- get array length
print(table.getn(a)) --> 6
print(#a)            --> 6

a = {x=1, y=1}
print(a.x, a.y) --> 1   1

a = {}
table.insert(a, 10)

--[[
{
  1 : 10
}
]]

```
Iterację tabeli zaczynamy od *1*. Więcej na temat tabeli w [dokumentacji](https://www.lua.org/pil/3.6.html).

### Instrukcje warunkowe
```lua
a = 10

if a == 9 then
    print("9")
elseif a == 10 then
    print("10")
else
    print("nothing")
end

if a ~= 9 then
    print("a != 9")
end

b = 0

if b then
    print("zero")
end

if not false then
    print("!false")
end

c = {}

if c then
    print("array")
end

print(not nil)     --> true
print(not false)   --> true
print(not 0)       --> false
print(not not nil) --> false

```

Jak widać, w przeciwieństwie do większości pozostałych języków programowania zamiast operatora `!=` jest `~=`, zamiast `!` jest `not`, a do tego `if 0 then` albo `if {} then` ma wartość `true` i blok się wykona.

### Pętle
```lua
for i = 1, 10 do
   print(i)
end

for i = 10, 1, -1 do
    print(i)
end

days = {"Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"}

for i, day in ipairs(days) do
    print(day)
end


local i = 1

while i <= 10 do
    print(i)
    i = i + 1
end

-- repeat if line is empty (if line string is "")
repeat
    line = io.read()
until line ~= ""
print(line)
```

### Funkcje
```lua
function add (a, b)
    return a + b
end

print(add(1, 2)) --> 3
```

### Klasy
```lua
Account = { balance = 0,
                withdraw = function (self, v)
                    self.balance = self.balance - v
                end
          }

function Account:deposit (v)
  self.balance = self.balance + v
end

Account.deposit(Account, 200.00)
Account:withdraw(100.00)

print(Account.balance) --> 100
```
[Klasy](https://www.lua.org/pil/16.1.html) generalnie są dość odjechane z tego co widziałem, więc nie będę tego opisywał, bo nie miałem dość czasu by to wszystko zrozumieć.

## Podsumowanie

Tyle z podstaw. Wszystkiego w tak krótkim czasie nie ogarnąłem, ale te postawy to już coś co pozwala coś napisać. O Torchu i o działaniu TorchCrafta napiszę następnym razem.
