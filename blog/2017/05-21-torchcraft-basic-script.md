---
title: TorchCraft - basic script
tags:
    - projects
    - dsp2017
    - lua
    - starcraft
    - torch
image: images/posts_thumbnails/torchcraft_basic_script.jpg

description: A post about the basics of working with TorchCraft. You will learn what maps in TorchCraft look like and how to create a basic script with a minimum of functionality.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

This week I was going to write about Torch itself and how to create neural networks in it, but I decided that I would focus on the very basics of TorchCraft itself and its interaction with Starcraft. TorchCraft, unfortunately, has poor documentation and apart from the installation description, almost everything has to be figured out based on examples from the `examples` directory.

<!-- truncate -->

## Maps

Let's start with the fact that TorchCraft can be run in two modes: micro and normal. In normal mode, you can play on regular multiplayer maps. There are no surprises here. Micro maps do not contain buildings and two groups of units fight on them. Maps must be specially prepared for this mode. Four maps come with TorchCraft: `dragoons_zealots.scm`, `m5v5_c_far.scm`, `sp_dragoons_zealots.scm`, `sp_m5v5_c_far.scm`. These are actually two maps in two versions each. I have no idea what the difference is, those with the `sp_` prefix maybe have something to do with single player?

Micro maps contain evenly spaced special, invisible units that reveal parts of the map (so-called Map Revealers), as well as Start Locations, i.e. points where units appear.

![dragoons_zealots.scm](/images/posts/torchcraft_basic_script/01_dragoons_zealots.png)

For these units to appear, so-called triggers are needed. They are created in the map editor in a special panel. Triggers allow you to do many different things, e.g. placing units on the map, controlling units, writing text on the screen, and in general - they allow you to control the game. Triggers contain two things: `conditions` - the conditions for which the trigger is fired, and `actions` - the actions triggered within a given trigger. You can also set separately for which player the trigger is activated.

Let's look at our micro maps:

![dragoons_zealots.scm](/images/posts/torchcraft_basic_script/02_dragoons_zealots.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/03_m5v5_c_far.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/04_m5v5_c_far.png)
![03_m5v5_c_far.scm](/images/posts/torchcraft_basic_script/05_m5v5_c_far.png)

We see that triggers at the very beginning of each game create several units for both players, and if necessary, units are sent to attack.

Ok, enough about the maps. Time to tackle the code.

## The code

First, let's write a minimal working example:


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

Let's analyze this example:

The first two lines are the host and port needed to connect to the host (Windows with Starcraft):

```Lua
local hostname = "192.168.56.1"
local port = 11111
```

Then we load the TorchCraft library:

```Lua
local tc = require 'torchcraft'
```

We switch TorchCraft to micro mode:

```Lua
tc.micro_battles = true
```

We start the connection:

```Lua
tc:init(hostname, port)
local update = tc:connect(port)
```

Then there is a loop in which we can give orders to units. In this example, we have not defined the loop termination conditions, so infinitely many battles will be played:

```Lua
while not tc.state.game_ended do
    update = tc:receive()

    -- code here
end
```

At the very end we close the connection:

```Lua
tc:close()
```

As you can see, it's very simple. But let's have some more fun. Let's add some configuration above the `while` loop:

```Lua
local setup = {
    tc.command(tc.set_speed, 20),
    tc.command(tc.set_gui, 1),
    tc.command(tc.set_cmd_optim, 1),
}

tc:send({table.concat(setup, ':')})
```

These are three commands. `set_speed` is responsible for the speed of the game, if we set it to zero, the game will be very fast, because the time between the execution of logical frames will be practically zero. `set_gui` set to `1` means that you can see the action. Whereas `set_cmd_optim` is the command optimization used by BWAPI, if set BWAPI tries to reduce the number of actions by grouping and executing similar commands. You can set values ​​from 0 to 4 ([documentation](https://bwapi.github.io/class_b_w_a_p_i_1_1_game.html#a2e44b952a0a55416da1628237bbc82ea)).

Let's see what is sent to TorchCraft:

```Lua
print({table.concat(setup, ':')})
```

We will get:

```Lua
{
  1 : "6,20:8,1:10,1"
}
```

We can see that commands are separated by colons and numeric command IDs are separated from values ​​by commas.

## Summary

Okay, that's it for now. Unfortunately, TorchCraft documentation is virtually non-existent, so I haven't been able to do much. For example, I haven't yet been able to figure out how to order a unit to move to another place without attacking anything along the way. Knowledge will have to be gained by reading code and constantly testing what works and what doesn't. It won't be easy :)
