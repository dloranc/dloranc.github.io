---
title: TorchCraft - Lua basics
tags:
    - projects
    - dsp2017
    - lua
    - starcraft
image: images/posts_thumbnails/torchcraft_lua_basics.png

description: I managed to install TorchCraft. I started writing code in Lua, and this post is a dump of my notes created while learning the language.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

Recently I didn't have enough time to finish installing TorchCraft. After writing [previous post](/2017/04/30/torchcraft-installation), I remembered that in NTFS there is something called "junction point", which is something like symlinks in Windows. If BWEnv.exe requires Starcraft with the path *C:\Starcraft*, just download [Junction](https://technet.microsoft.com/pl-pl/sysinternals/bb896768), move it to *C:\Windows\System32 * and execute in the console: **junction c:\Starcraft d:\Games\Starcraft**. It worked for me. Well, okay, it didn't really work, because the game ran in full screen (the config says that it should be in a window), something was working there, but after the second attempt to run BWEnv.exe it didn't want to run anymore. A better option turned out to be to use BWEnv.dll and launch the game through Chaoslaucher.

<!-- truncate -->

## Lua - basics
Ok, TorchCraft uses Torch to function (who would have thought?). Torch is a machine learning library based on the Lua scripting language. Since I didn't know Lua before, it was time to learn at least the basics. The language is best understood by reading the documentation and writing code to check specific parts of the language. Lua scripts have the extension `.lua` and are run by `lua <scriptname`. OK, time for examples:

### Variables are declared and initialized as follows:
```lua
j = 10         -- global variable
a = true
b = nil
local i = 1    -- local variable
```
`local` allows you to declare a local variable, i.e. limited to the scope of the block. You can read more about this in [documentation](https://www.lua.org/pil/4.2.html).

### Printing values on the screen
```lua
a = 10
b = nil     -- null value
s = "hello"
print(a, b) --> 10   nil
print(s)    --> hello
```

### Input data from the user
```lua
line = io.read()
```

### Comments (unusual syntax)
```lua
-- comment

--[[
block comment
]]
```

### String concatenation
```lua
print("Hello " .. "World")  --> Hello World
print(0 .. 1)               --> 01

a = "Hello"
print(a .. " World")   --> Hello World
print(a)               --> Hello
```
You can also see that strings are *immutable*.

### Arrays
There is such a thing as arrays in Lua, they resemble associative arrays known from PHP. You can index them using any value (except reserved words such as nil, while and so on).

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
We start the table iteration from *1*. More about arrays in [documentation](https://www.lua.org/pil/3.6.html).

### Conditional statements
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

As you can see, unlike most other programming languages, instead of the `!=` operator there is `~=`, instead of `!` there is `not`, and `if 0 then` or `if {} then` has the value `true ` and the block will execute.

### Loops
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

### Functions
```lua
function add (a, b)
    return a + b
end

print(add(1, 2)) --> 3
```

### Classes
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
[The classes](https://www.lua.org/pil/16.1.html) are generally pretty weird from what I've seen, so I won't describe it because I didn't have enough time to understand it all.

## Summary

Okay, I know the basics. I didn't understand everything in such a short time, but this syntax is something that allows me to write a basic script. I will write about Torch and how TorchCraft works next time.
