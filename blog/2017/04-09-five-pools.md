---
title: Five pools

tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
image: images/posts_thumbnails/5_pool.jpg

description: "Continuation of the fun with writing a bot for Starcraft: Brood War. I created a simple bot in Java that can do 5 pools."
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

Since the last post about the project, I've been working on the bot for quite some time, trying to write something that performs some simple strategy. After installing BWAPI, the bot starts and plays with the standard bot included in the game. As I had known the default bot and its weaknesses for years, I decided that my bot would perform a simple strategy called 5 pool with some modifications.

<!-- truncate -->

It looks like this:

1. If there are 50 minerals, then create a drone.
2. Take the created drone and send it to a potential enemy base. The maps on which bots play [SSCAIT](http://sscaitournament.com) have from two to a maximum of four possible base locations, so a drone can be sent to one, two or three locations depending on the map.
3. If there are 200 minerals and five drones, create a spawning pool.
4. If the drone encounters an enemy base, let it attack the nearest building and then run back to its base to collect minerals.
5. If the spawning pool is already built, create zerglings (and if necessary, overlords if you can't create zerglings because the unit limit has been reached) and let them attack the enemy's base.

As you can see, the strategy is very simple. In point four, I use the exceptionally stupid behavior of a standard StarCraft bot. If his base is attacked, he takes all the units and tries to destroy the attacked one. If we start running away with this unit, the bot will chase it to our base. This behavior has a huge impact on the bot's economy, because it does not mine for quite a long time, which means lose of the game. This play is not necessary, because without it you can easily beat the bot with a 5-pool, but I like to bully the artificial intelligence :)

## The code

I placed the code of this bot in [a separate repository](https://github.com/dloranc/five-pool-bot). I don't want to litter the competition because I won't write in Java.

This time I will describe the most important fragments of the code:

```Java
@Override
public void onStart() {
	// ...

    isScouting = false;
    isScoutingIdle = false;
    isSpawningPool = false;
    scoutDrone = null;
    buildDrone = null;
    hatchery = null;
    playerStartLocation = null;
    possibleEnemyBaseLocations = null;
    baseToScout = null;
    enemyBase = null;
    enemyBuildings = new EnemyBuildings();

    // ...
}
```

The above fragment prevents various bugs. If we do not set the class fields at the start of each game, the bot may behave incorrectly in the next game, because the bot instance is not created from scratch, but is used all the time, and the `onStart` function is called before the game starts. For example, I had problems with the fact that the drone selected for building could not build a **spawning pool** because it simply did not exist. `buildDrone` contained a reference to an object from the previous game.

The most important thing, however, is the `onFrame` function called every frame:

```Java
@Override
public void onFrame() {
    float supplyUsed = self.supplyUsed() / 2;
    float supplyTotal = self.supplyTotal() / 2;
    int dronesCount = getDronesCount();

    enemyBuildings.update(game);

    // ...

    for (Unit myUnit : self.getUnits()) {
        if (myUnit.getType() == UnitType.Zerg_Hatchery) {
            if (supplyTotal - supplyUsed <= 1) {
                if (self.minerals() >= 100) {
                    myUnit.train(UnitType.Zerg_Overlord);
                }
            } else {
                if (supplyUsed < 5) {
                    if (self.minerals() >= 50) {
                        myUnit.train(UnitType.Zerg_Drone);
                    }
                } else {
                    if (self.minerals() >= 50) {
                        myUnit.train(UnitType.Zerg_Zergling);
                    }
                }
            }
        }

        if ((myUnit.getType().isWorker() && myUnit.isIdle())) {
            gatherMinerals(myUnit);
        }

        if (myUnit.getType() == UnitType.Zerg_Zergling && myUnit.isIdle()) {
            attack(myUnit);
        }
    }

    scouting(dronesCount);

    if (dronesCount >= 5 && !isSpawningPool && self.minerals() >= 200) {
        buildSpawningPool();
    }
}
```

First, three auxiliary variables are initialized: `supplyUsed`, `supplyTotal` and `dronesCount`. The first two are actually unnecessary. I created them because BWAPI returns all supply values ​​occupied by units multiplied by two due to the fact that one zergling takes 0.5 supply. I'm used to game values, so it was easier for me to work with these variables. Whereas `dronesCount` is the number of drones. It is used to determine when to build a **spawning pool**.

The entire `onFrame` function includes checking and updating the set (HashSet) of enemy buildings, the order of building and producing units, and orders for units. It's all terribly sloppy, but I'll just write that it looked worse, so be glad you don't have to read the original mess I created :)

What else should I describe here so that the post doesn't get too long? Maybe what the attack looks like:

```Java
private void attack(Unit myUnit) {
    HashSet<Position> enemyBuildingPositions = enemyBuildings.getBuildings();

    if (!enemyBuildingPositions.isEmpty()) {
        Position enemyBuildingPosition = enemyBuildingPositions.iterator().next();
        myUnit.attack(enemyBuildingPosition);
    } else {
        if (enemyBase != null) {
            myUnit.attack(enemyBase.getPosition());
        } else {
            ThreadLocalRandom random = ThreadLocalRandom.current();

            Position randomPosition = new Position(
                    random.nextInt(game.mapWidth() * 32),
                    random.nextInt(game.mapHeight() * 32)
            );

            if (myUnit.canAttack(randomPosition)) {
                myUnit.attack(randomPosition);
            }
        }
    }
}
```

It's simple - if the scouting drone detects any enemy buildings (i.e. the enemy's base), the zerglings attack them. If not, the position where the enemy's base should be located is attacked. If we don't know it, zerglings are running around the map looking for the enemy and his buildings. This number 32 when drawing positions is the size of one Tile.

## Summary

The bot works quite well, sometimes it goes a bit crazy on large maps when the scouting drone doesn't find an opponent in the first two possible locations, but it's not a problem, because it wins anyway. Another problem is the **Electro Circuit** map, which has **Psi Disrupters** in some places. Starcraft's extremely poor pathfinding causes some units to hang on these buildings while trying to move on. To get around this, I would probably have to write my own pathfinding algorithm :)

A few things could be improved:

- Mineral gathering can be optimized according to this topic on [TeamLiquid](http://www.teamliquid.net/forum/brood-war/484849-improving-mineral-gathering-rate-in-brood-war).
- <strike>The scout should be a created drone, not one drawn from the initial ones.</strike>
- <strike>If a drone intended for building intends to build, it should collect minerals if it has collected any before building. Now it's like that if she had any, they are lost.</strike>
- <strike>Scout may be more optimal, the drone should go to the bases that are closest to them.</strike>
- <strike>Sometimes when a drone is going to the last base on a large map and zerglings are produced, they move to random places on the map because they don't know where the opponent's base is. This can be improved by sending them to the base where the drone is heading, because then you know that this is the right base.</strike>
- Zerglings can fight better, you can apply priorities on what to attack first. It would also be useful to withdraw severely wounded units to regenerate.
- <strike>If the base and buildings around it are destroyed and the game is not over, it means that there is a building somewhere on the map that needs to be destroyed. Zerglings don't even search randomly, they just gather in one place.</strike>
- In general, it would be useful to write some class that allows you to give orders to units and cancel them when certain circumstances arise.

The code itself is not of high quality either. This mess needs to be cleaned up. It would be useful to separate most of the code into separate classes and create some logic for implementing the build order.

You can see the bot in action here:

<iframe src="https://www.youtube.com/embed/xvI2EuLPg6o" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## What's next?

I more or less learned how to write a bot and learned some of the problems associated with it. Now you can finally start **reinforcement learning**. I think machine learning could be used in this bot to make zerglings fight better. But more about that in the next posts.
