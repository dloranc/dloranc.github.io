---
title: A little information about Starcraft and my plans

tags:
    - projects
    - dsp2017
    - starcraft
image: images/posts_thumbnails/about_starcraft.jpg
description: A post explaining a bit about Starcraft 2 for people who have never played the game. On top of that, I also wrote about my plans for the project as part of "Let Yourself Be Known 2017."
---
It's time to get started, the previous post on the "Daj Się Poznać 2017" category was basically a post needed to create the category and RSS feed necessary to participate in the contest. Sculpin, which I use, requires the creation of any post assigned to a category to generate it.

<!-- truncate -->

## Why Starcraft?

A few months ago, the company [DeepMind announced at BlizzCon](https://deepmind.com/blog/deepmind-and-blizzard-release-starcraft-ii-ai-research-environment) that it had worked in collaboration with Blizzard to write an environment that would allow bots to be written for Starcraft 2. Previously, the DeepMind folks had created a bot playing the popular Asian board game Go, in which a human was for a long time unbeatable by a computer. Of course, DeepMind is not creating this environment for Starcraft because they love to create bots simply because bot research will help develop machine learning algorithms, specifically reinforcement learning, transfer learning, unsupervised learning, curriculum learning and other areas of machine learning. Starcraft is the next step, the defeat of which will bring us closer to or even enable us to create AGI (Artificial General Intelligence), which is an artificial intelligence that will be as versatile as a human, as opposed to ANI (Artificial Narrow Intelligence), which is only good in one narrow field.

I'm joining this race, but to tell the truth I don't have much of a chance :) Where do I, a poor programmer, to the computing power of Google and their teams of researchers? I don't even have a graphics card with CUDA. However, I'm starting from the premise that what matters is having fun and learning. And that's what I intend to stick to.

## What is Starcraft?

Starcraft 2 is currently by far the most popular e-sports real-time strategy game. We can play it with three diverse races: Zergs, Protoss and Terrans. The Zerg are an insectoid race that can mutate as needed. Terrans, on the other hand, are humans. They have tanks and other such fun stuff. The Protoss are a humanoid race connected by telepathic ties. All in gold, teleportation is their middle name, they constantly talk about dying for Aiur.

The goal of each game is to destroy all enemy buildings. It is not necessary to destroy the entire enemy army, it is enough to raze every building. The game can also result in a draw. I don't remember exactly how, but for probably three minutes neither side can collect resources, destroy anything or build anything. This rarely happens, by the way (it worked out for me once).

In order to win we have to collect raw materials (there are two: minerals and gas), construct buildings, create an army and invent upgrades, i.e. do what in basically every other RTS. There is a unit limit and it is 200.

The game is very challenging, everything moves fast and you have to be really skillful to survive :) To be good you need to have a good micro and macro. Micro is simply managing units, especially troops during skirmishes. Macro, on the other hand, is managing the economy. You need to build enough workers, have a saturation of bases (optimally 16 workers for minerals and 3 workers for each gas in each base), manage cyclic things specific to each race like larva injects, chrono boosts, or mule drops. From experience, I have to write that the most important thing is macro. What's the use of a good micro if you don't have anything to micro with?

An example of a really difficult micro:

<iframe src="https://www.youtube.com/embed/SUXUPLVfT-g" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

In a typical game, you may encounter the following: you can play a macro game, an all-ins, or a timing attack. A typical macro game is usually quite long, with players developing quietly without doing risky things. Sometimes such games end up with base trades, a situation where players instead of fighting armies against each other try to destroy enemy bases. All-ins, on the other hand, are situations where we sacrifice economy development at the beginning of the game, make an army and try to crush the opponent with the advantage of an army as fast as possible. If the all-in doesn't go in, we mostly lose the game because the economic losses are too high. A timing attack, on the other hand, is when we try to take advantage of certain weaknesses in the opponent's build by attacking at a specific moment when the opponent is weaker in some way. If the timing attack goes in then we win.

A long macro game:

<iframe src="https://www.youtube.com/embed/cRLcG5uGcP4" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

All-in:

<iframe src="https://www.youtube.com/embed/s81IA2y_TVc" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

Timings:

<iframe width="560" height="600" src="https://www.youtube.com/embed/A8LWvf6Sxl0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

Basetrade:

<iframe src="https://www.youtube.com/embed/GQFOHEg78kM" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## Why is this game so difficult for AI?

First of all, in Starcraft, most information is unavailable to the player. A well-played bot will have to use memory effectively, plan in the long term, modify plans significantly in response to the opponent's actions. In the game it is also possible to have really many actions to perform, the bot will also have to plan them. Such, for example, to build a building is to select some worker, click somewhere on the map (change the camera), select a building from the list of actions of a given worker and click on the area to start construction.

The bot environment will have a scripting interface like the previous part of Starcraft (i.e. something like BWAPI), and a simple GUI generated so that bots can learn from pixels. On top of that, scripts for training (for curriculum learning) are yet to be published.

<iframe width="1075" height="600" src="https://www.youtube.com/embed/5iZlrBqDYPM" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## My plans

I would certainly like to train a bot that at least can fight with practically every possible composition of units for a given race. For this, I would like to realize a scenario of simplified gameplay, in which the bot can build only a basic fighting unit (Zergling, Zealot, Marine).

For now, the environment has not been made available (it is rumored to be in the first quarter of 2017, that is, this month), so for now I will play with replays, which will be necessary to train the neural networks later anyway. However, if I run out of ideas on what to do with replays I will probably try to write a simplified version of Starcraft in JS on canvas and make some simple scenarios for that.

All code will be on my GitHub repository [starcraft-ai](https://github.com/dloranc/starcraft-ai).
