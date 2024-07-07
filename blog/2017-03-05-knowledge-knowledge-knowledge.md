---
title: Knowledge, knowledge, knowledge

tags:
    - dsp2017
image: images/posts_thumbnails/books.jpg
description: Dump of a dozen links from my bookmarks that I find useful for the project, as well as future plans.
---
*This post is about a Starcraft bot I am developing that uses machine learning. The project is being developed as part of the "Daj Się Poznać 2017" contest.

---

The next few weeks will be spent blogging and creating [a project](https://github.com/dloranc/starcraft-ai) for "Daj Się Poznać 2017." contest. The project requires things I don't know how to do very well yet. That's why I decided that this post will be such an attempt to encompass everything I should focus on in the near future. I really have a lot of bookmarks, especially articles from Arxiv, it is necessary to embrace this mess, make a selection and finally start reading and processing it :)

<!-- truncate -->

## Books and courses

I will definitely have to learn reinforcement learning eventually, starting with these basic and standard methods and ending with the current "state of art".

1. [Reinforcement Learning: An Introduction](http://incompleteideas.net/sutton/book/the-book-2nd.html) - for starters, I'm going to try to learn from this supposedly classic position on the subject of reinforcement learning by Richard S. Sutton and Andrew G. Barto.

2. [Kurs Reinforcement Learning na Udacity](https://www.udacity.com/course/reinforcement-learning--ud600) - this will have to be started and finished again from the beginning.

3. [UC Berkeley CS188 Intro to AI](http://ai.berkeley.edu/home.html) - someone from the contest's Slack recommended this to me, I haven't had time to review the whole thing, but it looks interesting.

I guess that's it for the basics. Next will be more interesting, I collected some links from [r/machinelearning](https://reddit.com/r/MachineLearning/), the number of them in my bookmarks is overwhelming, so I chose the ones I think are the most relevant:

## Arxiv

1. [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602) - probably already a classic work about learning a neural network based on pixels. I intend to create one of the first models of my bot based on it.

2. [Deep Recurrent Q-Learning for Partially Observable MDPs](https://arxiv.org/abs/1507.06527) - Starcraft is POMDP, so this article should come in handy to some extent.

3. [Training Agent for First-Person Shooter Game with Actor-Critic Curriculum Learning](https://openreview.net/pdf?id=Hk3mPK5gg) - something that might be useful to me, I will definitely need some form of curriculum learning.

4. [Asynchronous Methods for Deep Reinforcement Learning](https://arxiv.org/abs/1602.01783) - to quote the abstract: "The best performing method, an asynchronous variant of actor-critic, surpasses the current state-of-the-art on the Atari domain while training for half the time on a single multi-core CPU instead of a GPU". This will definitely come in handy for me as I don't have a GPU.

5. [PathNet: Evolution Channels Gradient Descent in Super Neural Networks](https://arxiv.org/abs/1701.08734) - fresh work, training multiple neural networks with knowledge transfer and selection using a genetic algorithm.

Plus, of course, the list from [awesome-deep-reinforcement-learning](https://github.com/williamd4112/awesome-deep-reinforcement-learning).

## Summary

That's it for now, I've chosen what I think are the most important things. I will spend this month learning about theory and creating simple models in OpenAI Gym. As for the project, this week I will be playing around with replay analysis using [sc2reader](https://github.com/GraylinKim/sc2reader) and [s2protocol](https://github.com/Blizzard/s2protocol).
