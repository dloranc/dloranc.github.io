---
title: Torchcraft - analysis and changing the game state
tags:
    - projects
    - dsp2017
    - lua
    - starcraft
    - torch
image: images/posts_thumbnails/torchcraft_game_state_change_and_analysis.jpg

description: A post about how to change the game state by analyzing it and giving orders to units.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

In the last [post about the project](/2017/05/21/torchcraft-basic-script) I described how the maps look like and wrote how to create a basic script that connects to Starcraft and downloads the game state in a loop, or rather each subsequent logical frame games. I don't think I've written yet what a logical game frame is. The thing with logical frames is that graphics rendering is independent of calculations that change the game state. The frame rate is not constant and depends on the speed of your computer. The game state is calculated every interval. If you have played Starcraft, you probably know that you can set the game speed in the options. Changing the speed results in a change in the time between logical frame calculations. This is a fundamental difference, if we had constant 30 or 60 FPS, the issue would probably be solved differently.

<!-- truncate -->

## Game state

OK, time to check what we have available in terms of game status. First, let me remind you of the basic script from the previous note:

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

In TorchCraft, the game state changes every logical frame. You can access it by referring to `tc.state`. This variable is a table with the following keys:

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

And not only that, there is also `units_neutral` (contains animals, minerals and gases) and probably a few others, but I would have to look for that in the TorchCraft code. I took this comment above from TorchCraft's code.

As you can see, the basic script already uses `game_ended`.

An interesting structure is `map_data`. This is the `ByteTensor` from Torch and contains information about the map, such as places that units cannot go to and the like. Very useful. For *m5v5_c_far.scm* the map size is 256x256 and can be obtained by:

```Lua
local map = tc.state.map_data
print(map:size())
```

For us, the most interesting ones will be `units_myself`, `units_enemy` and `bullets`. Let's check what `units_myself` contains:

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

A lot of data about the unit.

## Commands

It's time to give orders to units. Let's work through the while loop:

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

At the very beginning of the battle, the above code gives an order to attack the place where enemy units are located. To issue commands in a given frame, we create an `actions` table:

```Lua
local actions = {}
```

Then we iterate over all our units:

```Lua
for uid, unit in pairs(tc.state.units_myself) do
	-- ...
end
```

The `pairs` function returns keys and values ​​separately. They are assigned to the variables `uid`, `unit`.

We create commands by calling `tc.command` with the specified arguments:

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

The first argument, I have no idea what it does, the second is the unit id (each is unique), the third is the command, the fourth - I have no idea, the fifth and sixth are the x and y positions. We insert the commands into the `actions` table by using `table.insert` .

Time to send commands to Starcraft:

```Lua
tc:send({table.concat(actions, ':')})
```

The above code merges the array into a string, with each command separated by a colon, and sends.

The above example also includes the `give_orders` variable. I added it to avoid command spamming. Spam causes Starcraft to run slowly and units, instead of attacking what is on the way, go to a given location regardless of anything.

## Summary

It's not difficult, it just took me some time to understand why giving the movement order doesn't work. It turned out that you need to add this magical `-1` before the x and y positions. The operation of the presented code can be seen in the gif below.

![TorchCraft - simple battle](/images/posts/torchcraft_game_state_change_and_analysis/torchcraft_battle.gif)

In the next post I will try to either describe more things or finally use machine learning (Q-learning). We'll see if I have time.
