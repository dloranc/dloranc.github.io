---
title: Learning BWAPI
tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
    - java
image: images/posts_thumbnails/learning_bwapi.jpg

description: We fine-tune the bot, learn BWAPI, its debugging functions and other useful things.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

I spent this week polishing up my Starcraft bot. I didn't want to take up reinforcement learning yet because I preferred to spend my time learning about BWAPI. The code can be viewed here in my repository [dloranc/five-pool-bot](https://github.com/dloranc/five-pool-bot).

<!-- truncate -->

## Fixes

In a previous post I wrote a to-do list. Some of them were successfully completed (these are crossed out below):

- Mineral gathering can be optimized according to this topic on [TeamLiquid](http://www.teamliquid.net/forum/brood-war/484849-improving-mineral-gathering-rate-in-brood-war).
- <strike>The scout should be a created drone, not one drawn from the initial ones.</strike>
- <strike>If a drone intended for building intends to build, it should collect minerals if it has collected any before building. Now it's like that if she had any, they are lost.</strike>
- <strike>Scout may be more optimal, the drone should go to the bases that are closest to them.</strike>
- <strike>Sometimes when a drone is going to the last base on a large map and zerglings are produced, they move to random places on the map because they don't know where the opponent's base is. This can be improved by sending them to the base where the drone is heading, because then you know that this is the right base.</strike>
- Zerglings can fight better, you can apply priorities on what to attack first. It would also be useful to withdraw severely wounded units to regenerate.
- <strike>If the base and buildings around it are destroyed and the game is not over, it means that there is a building somewhere on the map that needs to be destroyed. Zerglings don't even search randomly, they just gather in one place.</strike>
- In general, it would be useful to write some class that allows you to give orders to units and cancel them when certain circumstances arise.

I especially had an interesting experience with bringing minerals back by drone before building the **Spawning Pool**. The sample logic should look something like this:

```Java
if (buildDrone.isCarryingMinerals()) {
	buildDrone.returnCargo();
} else {
	// ...

	buildDrone.build(UnitType.Zerg_Spawning_Pool, buildPosition);
}
```

But I found that sometimes it doesn't work. Looking at the [BWAPI documentation](https://bwapi.github.io/class_b_w_a_p_i_1_1_unitset.html#a0b24b5f25b609169c0fafbe70d2f60aa) of the `returnCargo` function, I noticed the following comment:

> There is a small chance for a command to fail after it has been passed to Broodwar.

What's interesting is that at this point in the documentation this note is under almost every function. I wonder what causes the inability to perform a given action? And are you sure there wasn't some problem with my code?

I solved this problem differently, but not entirely optimally. It is possible that all drones will have minerals and the building algorithm must wait until one of them brings the minerals to the base. I don't know if such a small waste of time can sometimes be crucial to winning the game. I don't think so, but I like to have everything 100%.

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

## Drawing auxiliary figures

**BWAPI** provides [a dozen or so cool methods for drawing](https://bwapi.github.io/class_b_w_a_p_i_1_1_game.html) points, lines, squares, circles, ellipses, triangles, as well as for writing text on the screen.

Each method starts with the word `draw` and is called on an object of type `Game`. After the word `draw` we give what we want to draw (`Text`, `Box`, `Triangle`, `Dot`, `Circle`, `Ellipse`, `Line`), after which we can also add a word indicating how * *BWAPI** is supposed to interpret the transmitted coordinates. If we want to draw a square on the map, we call the `drawBoxMap` method, if we want to draw on the screen, we call `drawBoxScreen`. The position `(0, 0)` will then be the upper left corner. We can also use `drawBoxMouse`, then the position `(0, 0)` will mean drawing a square where the cursor is.

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

I used this to graphically visualize the orders (in red in the screenshot below) that the units carry out. I have marked chokepoints on the map, i.e. narrow places that are important for strategic reasons (yellow). I also drew the zones where land units cannot move (in gray). The only question is why I had to multiply all the positions of the polygon points by 8? I also marked the place where the enemy's base is (in the screenshot in the header) with a circle. This was useful for me when debugging scouting.

![Luxiliary lines](/images/posts/learning_bwapi/01.jpg "Luxiliary lines")

## Other useful things

On [starcraftai.com](http://www.starcraftai.com/wiki/Increasing_StarCraft_Speed) I discovered two ways to speed up the game. The first way is to completely turn off the sound engine, because normally even if we set the volume to zero, the functions that play sound and music will be called. Turning off the engine prevents these functions from being activated. To tell you the truth, I didn't notice the game speeding up much, but I turned it off just to be on the safe side.

```ini
[starcraft]
; Game sound engine = ON | OFF
sound = OFF
```

The second cool thing is the ability to turn off graphics rendering when the match starts. Well, almost, because from what I saw, sometimes it will render a frame.

```Java
game.setGUI(false);
```

I discovered that it is also possible to run Starcraft in **headless** mode (without rendering any graphics) on the command line. This can be done using the [tscmoo/bwheadless](https://github.com/tscmoo/bwheadless) project. I managed to compile it, but haven't tested it yet. It will definitely be useful. It's a pity that this project doesn't have at least **README.md**.

## What's next?

Now I will finally start reinforcement learning. My guess is that you can win most games, even with bots that have good micro, only with an early Zergling attack. With a perfect micro, especially Protoss may have big problems, because its basic unit, the **Zealot**, is very slow and is unable to keep up with the Zergligs. All I need is for my bot to focus on the buildings, avoiding the opponent as much as possible, and the game will be won. This is of course my hypothesis, we'll see how it comes out in the wash.

The question remains what to use. I tried TorchCraft, but it didn't solve my problems. TorchCraft uses the **Lua** language, and I would like to check my bot in [SSCAIT](http://sscaitournament.com), and there you can only report bots in Java and C++. Maybe combine what I've already written with [deeplearning4j](https://deeplearning4j.org/)? I think I'll do that, I want to check how much my bot will be worth.
