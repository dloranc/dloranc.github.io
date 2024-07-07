---
title: Change of plans

tags:
    - projects
    - dsp2017
    - starcraft
image: images/posts_thumbnails/broodwar.jpg

description: "I am writing a bot for Starcraft: Brood War. In today's post I explain the reasons that prompted me to make this change."
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

Unfortunately, Blizzard and DeepMind failed to create the API and moved the release date to summer this year, which they announced on the [Battle.net forum](https://us.battle.net/forums/en/sc2/topic/20753825636):

> We wanted to give you all an update on the progress of the StarCraft II API. Blizzard and DeepMind remain hard at work together defining the API and infrastructure needed to do world class research in StarCraft II. Like many research projects we’ve been learning a lot as we’ve gone along on this new endeavor. We’re eager to get a polished set of tools and documentation into the hands of researchers and developers as soon as possible. Originally we’d hoped to have the API ready by Q1 of this year but think it’s best to shift the official release back to this summer to provide a level of quality and completeness that we know you expect from us.

<!-- truncate -->

> We appreciate everyone’s patience as we continue to work on the API – our goal is to bring you the best possible tool, with thorough documentation.

Typical Blizzard :) I suspect that the API will be released at the same time as the premiere of the remastered first part of Starcraft, which is also scheduled for release this summer.

Therefore, I decided to start writing a bot for Starcraft: Brood War. It won't be easy, because as I wrote earlier, this is a rather unfriendly environment when it comes to machine learning. I was also thinking about writing something Starcraft-like myself, I even have something written in Phaser, but it will end with some simple examples, because I would be too embarrassed to write my own RTS from scratch. I will use this code for posts about reinforcement learning.

## BWAPI + BWMirror

To write a bot for SC:BW you need to install Starcraft (who would have guessed) version 1.16.1 and [BWAPI (The Brood War API)](https://github.com/bwapi/bwapi), and as I used from the tutorial on the website [Student StarCraft AI Tournament](http://sscaitournament.com/index.php?action=tutorial), plus BWMirror, which is a Java wrapper for BWAPI. This is quite simple, I only omitted the recommended installation of Eclipse and connected the project to IntelliJ IDEA, because I already had this IDE installed. The game is launched via Chaoslauncher, which injects DLLs (or something like that, I don't know) that change the game or extract data from it.

It is also worth setting the following values ​​in `bwapi.ini`:

```ini
auto_menu = SINGLE_PLAYER
maps = maps\sscai\*.sc?
```

This saves a lot of time because you don't have to click through individual game windows all the time.

By the way, it is worth unchecking W-MODE in Chaoslauncher, which allows you to run the game in a window. The `CTRL+F1` keyboard shortcut will also be useful, as it allows you to limit mouse movement to the entire game window. It is also useful to be able to enlarge the game window and its content twice by clicking the `2x` icon in the upper right corner. There is probably a keyboard shortcut for this, but I didn't feel like looking for it.

An example bot from the shared package looks like this:

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

It doesn't do much, it just lists the units on the screen and directs all the slacking units to collect minerals. The whole thing, I think, is quite self-explanatory, so there is no point in describing this code further.

## What's next?

I'll play around with Java some more. I've even created a bot that creates units and scouts, but I haven't figured out how to build a building yet. The sample code from the previously linked tutorial does not work. That's bad. Once I create a simple 5-pool bot, I'll try machine learning using [TorchCraft](https://github.com/TorchCraft/TorchCraft), or something else, if I can find it, because I don't like writing in Lua.
