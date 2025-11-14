---
title: Reinforcement learning - what is it?
tags:
  - sutton_barto
  - dsp2017
  - reinforcement_learning
image: images/posts_thumbnails/reinforcement_learning_what_is_it.jpg

description: A post in which I explain what reinforcement learning is.
---

## Before we start

For some time now I have been trying to slowly read the book ["Reinforcement Learning: An Introduction"](http://incompleteideas.net/sutton/book/the-book-2nd.html) by Richard S. Sutton and Andrew G. Barto. Someone asked for some good RL materials in one of my posts, so I'm sharing and recommending this book. This is supposedly a classic book in this field. In my opinion, it deserves this name, if one can say so after reading less than two chapters of this book.

<!-- truncate -->

To consolidate my knowledge, I decided to write code for the algorithms found in this book. There are sample codes on the website linked above, but I don't intend to use them (maybe if I get completely stuck on something). Repository (empty for now): [dloranc/reinforcement-learning-an-introduction](https://github.com/dloranc/reinforcement-learning-an-introduction).

## Reinforcement Learning - what is it?

Reinforcement Learning is a certain way of solving some problems that cannot be solved in a simple way (analytically) or we do not have a good model. Something, we'll call it an **agent**, performs certain **actions** in some unknown **environment** that is in a certain **state**. For taking action, the agent receives a reinforcement signal. It can be positive (**reward**) or negative (**punishment**). By interacting with the environment, an agent learns a certain **politics**. The goal of reinforcement learning is to determine the optimal **policy** for which we will receive as many rewards as possible. Finding such a policy is not easy. Sometimes, for example, it is worth sacrificing rewards to gain in the long run.

![Reinforcement learning - schema](/images/posts/reinforcement_learning_what_is_it/reinforcement_learning_english.svg "Reinforcement learning - schema")

It is a way of teaching inspired by the achievements of [behavioral psychology](https://en.wikipedia.org/wiki/Reinforcement). Animals learn about the world this way (humans are more complicated). For example, imagine a small dog learning to walk. Trying to learn this task, he performs various actions by trial and error. Thanks to his senses, he receives certain stimuli from the world and takes certain actions depending on them. If they don't fail, they will perform good actions that were successful more often and better (positive reinforcement). If it fails the floor, it will try not to take actions that would result in this result next time. And so on until he learns to walk.

In the table below I have provided examples of various agents, environments, etc. etc.:

| Agent          | Environment | State                                                   | Action                       | Policy wanted                     |
| -------------- | ----------- | ------------------------------------------------------- | ---------------------------- | --------------------------------- |
| animal         | world       | state of the world, the position in which the animal is | limb movements               | learning to walk                  |
| robot          | factory     | data from sensors, position of manipulators             | movement of manipulators     | sorting items                     |
| bot playing Go | board       | current position on the board                           | placing a stone on the board | winning as many games as possible |

But it doesn't matter what the tables are, let's see it in real projects. I've put together a playlist of some cool examples below:

<iframe src="https://www.youtube.com/embed/SH3bADiB7uQ?list=PL5nBAYUyJTrM48dViibyi68urttMlUv7e" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

I find this pancake-tossing robot particularly cute:

<iframe src="https://www.youtube.com/embed/W_gxLKSsSIE" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## How does reinforcement learning differ from other methods?

For example, what is the difference between supervised learning and reinforcement learning? In supervised learning, we receive some data and it is already pre-classified. Based on them, the algorithm must learn how to distinguish them (classify) or how to predict a certain value based on them (regression). We don't have anything for starters in reinforcement learning. We need to find a solution based on performing actions in the environment and on rewards/punishments. In addition, there is the problem of exploring and using knowledge acquired through interaction with the environment. This does not occur in other machine learning paradigms. In unsupervised learning it is similar, we receive some data and we have to classify it somehow. However, we are not guided by rewards/punishments but by their structure.
