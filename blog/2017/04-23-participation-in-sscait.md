---
title: Participation in SSCAIT
tags:
    - projects
    - java
    - dsp2017
    - starcraft
image: images/posts_thumbnails/sscait.jpg

description: A post about my participation in SSCAIT and further improvements to the bot.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

So far, I have been testing my bot on my computer against the default bot created by Blizzard. It's time to test yourself against other bot creators. I know that instead of the standard bot, you can connect another one using **Chaoslauncher - MultiInstance** and editing `bwapi.ini`, but I preferred to see first what the registration procedure in [SSCAIT](http://sscaitournament.com) looks like.

<!-- truncate -->

To register a bot in **SSCAIT**, in addition to providing various data, you need to generate a `.jar` file and insert it into the ZIP together with `BWAPI.dll`, the DLL responsible for connecting to Starcraft. Each bot can use a different version of BWAPI, so you need to include your DLL. Without thinking much, I generated `artifact` in IntelliJ IDEA, but after registration it turned out that my bot crashed six times and was blocked. I did something wrong and I didn't really know what. However, I noticed that in the results list there are links to download bots. I downloaded one written in Java, changed the extension from `.jar` to `.zip` and checked the file structure. It should look like this:

![artifacts](/images/posts/sscait/artifacts.png "artifacts")

In particular, the `META-INF` directory containing the `MANIFEST.MF` file with a defined entrypoint is necessary, so that Java knows which class is the main one with the `main` method.

```ini
Manifest-Version: 1.0
Main-Class: dloranc.fivepoolbot.FivePoolBot
```

It took me a while, I'm sharing it for the future, because the tutorial on the SSCAIT website didn't contain much information about creating a working package.

As for my results in SSCAIT, after a few days I have 15 games won and 20 lost (I subtracted crashes). In my opinion, not bad for such a simple bot, especially since I was ahead of 15 bots in the [scorelist](http://sscaitournament.com/index.php?action=scores).

## Serious bug in the code from the tutorial

While watching the replays, I noticed that my bot was behaving incorrectly. Sometimes, for unexplained reasons, he was unable to detect enemy buildings, which resulted in the attack going to the wrong location, which meant losing the game. After quite a lot of thinking, I managed to find out that the problem was not remembering the location of the enemy's buildings correctly. I even managed to visualize it. You can see this in the gif below:

![Incorrect operation](/images/posts/sscait/invalid_rescaled.gif "Incorrect operation")

Very interesting, because I copied the code for this solution from the tutorial on the SSCAIT website and assumed that everything worked. But no - some buildings did not have a red dot or it disappeared every frame, which resulted in the dot flashing on the screen.

A riddle for you: where is the error in the code below?

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

It took me a lot of time, and the error was trivial and consisted in the following line:

```Java
if ((u.getType().isBuilding()) && (u.getPosition() == p)) {
```

I replaced it with (by the way I got rid of the excess brackets):

```Java
if (u.getType().isBuilding() && u.getPosition().equals(p)) {
```

Well, in Java, if we want to compare two objects, we use `equals()` because the `==` operator compares references to objects.

After the fix, nothing flashes:

![Correct action](/images/posts/sscait/valid_rescaled.gif "Correct action")
