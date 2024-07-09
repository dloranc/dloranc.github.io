---
title: Daj Się Poznać 2017 - competition summary
tags:
    - organizational_matters
    - dsp2017
image: images/posts_thumbnails/daj_sie_poznac_2017_competition_sum.jpg

description: As in the title, it's time to sum up my participation in the Daj Się Poznać 2017 competition. What was successful? Which did not? What's next?
---
Well, I was going to write a post about the project, but I couldn't do it for anything in the world, so I decided to do what the rest of the participants did, that is, sum up the competition and my participation in it. Sorry, but I will be boring :)

<!-- truncate -->

## Project - development history
Maybe you don't remember, but as part of the competition, I decided to develop a bot project for Starcraft 2 using reinforcement learning. It wasn't a very smart idea, because there was no API for creating bots at that time, and I naively assumed that Blizzard and DeepMind would be ready for this *first quarter of 2017*. They didn't make it, the API will be available only in the summer. I didn't know what to do, first I decided to create my own, simplified Starcraft in Phaser (a framework for writing games in JavaScript). I even wrote something there, it is in one repository ([dloranc/simple-rts-and-rl-example](https://github.com/dloranc/simple-rts-and-rl-example)), but it quickly became I discouraged. Too much work with this. I would have to write things like path-finding, and I wasn't happy about it. Ultimately, I abandoned this project, but it is possible that I will do something with it in the near future, a simple example with reinforcement learning.

Finally, I decided to take on Starcraft: Brood War, the predecessor of Starcraft 2. I put together quite quickly in Java, using BWAPI and BWMirror, a simple bot performing a very simple strategy known as *5 pool*. I entered the bot into the SSCAIT tournament/ladder. Surprisingly, he does quite well on ladder considering his simplicity. His results can be viewed on the [results] page(http://sscaitournament.com/index.php?action=scores). This bot is located in the [dloranc/five-pool-bot](https://github.com/dloranc/five-pool-bot) repository.

You can see the bot in action here:

<iframe src="https://www.youtube.com/embed/xvI2EuLPg6o" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

After writing this bot, I planned to use RL, but it turned out that BWMirror is only 32-bit, so I couldn't use Java libraries because they are only 64-bit. I would have to transfer the bot from BWMirror to something else. I didn't feel like it too much, so I decided to switch to TorchCraft, a library that allows you to develop bots using machine learning. I still struggle with this today and it's not easy because this library has virtually no documentation.

In total, I created four repositories for the project. There were a total of 103 commits, which is rather average. I also regret that I didn't manage to do anything with machine learning.

I will continue to develop all projects, except maybe the one with pool 5, because it is completed and there is not much that can be added there.

## The rest of the blog
I'm even quite satisfied with the remaining posts. During the competition, I started a series of posts about reinforcement learning based on the book I was reading, Reinforcement Learning: An Introduction (Richard S. Sutton and Andrew G. Barto). All can be found under the tag [Sutton & Barto](/tags/sutton-and-barto) and the repository with examples is [dloranc/reinforcement-learning-an-introduction](https://github.com/dloranc/reinforcement-learning-an-introduction). I'm doing quite well, but I think I'm explaining it all a bit poorly. There is a lot of room for improvement here. The idea to start this series was good, earlier during the competition I had problems with selecting topics. I didn't have any ideas for posts, but now I just need to read the chapters from this book and it's good :)

## What did the competition give me?
Where to start... I learned to create posts relatively quickly. No wonder, the people wrote that a person becomes faster in writing by writing and it is true. However, I won't say that my posts are good, because as I wrote above, I have a problem with explaining things simply. I overcomplicate some things. I have a lot of training ahead of me here, I will have to look through my posts and think about what can be written better and simpler.

The second thing is that I managed to write quite regularly. I've always had a problem with this. Here I must admit that I took part in the first edition of "Daj Się Poznać" ("Let yourself be known"), the one in which there were not even a hundred participants. Then I dropped after two posts. It was a tragedy. However, I made it to the end of this year's edition and I consider it a success. Writing and developing the project was incredibly time-consuming, but it worked and I'm happy with it.

## Have I made myself known?
Heh, not really. It's true that there was some interest in my bot at the beginning and a few people even commented, but nothing has happened on my blog for a long time :) Analytics doesn't show much either. The most sessions I had were 38, about halfway through the competition. I was promoting something on Twitter, but the last month was poor. To tell you the truth, I thought it would be worse.

## Acknowledgments

Finally, I would like to thank the organizer Maciej Aniserowicz for organizing this competition. By the way, I apologize for my RSS :) I would also like to thank the readers of this blog (are there any?) for reading my stuff (comment more often, please!). I would also like to thank the other competition participants for sharing their knowledge and for conversations on Slack.

Thank you very much :)
