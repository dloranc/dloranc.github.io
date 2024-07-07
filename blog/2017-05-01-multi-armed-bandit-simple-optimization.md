---
title: Multi-armed bandit - simple optimization
tags:
    - sutton_barto
    - dsp2017
    - python
    - multi_armed_bandit
    - reinforcement_learning
image: images/posts_thumbnails/multi_armed_bandit_simple_optimization.jpg

description: A post about some optimization method allowing for lower memory and CPU consumption for the algorithm presented in the previous post about the multi-armed bandit problem.
---
*This post is part of my struggle with the book ["Reinforcement Learning: An Introduction"](http://incompleteideas.net/sutton/book/the-book-2nd.html) by Richard S. Sutton and Andrew G. Barto. Other posts systematizing my knowledge and presenting the code I wrote can be found under the tag [Sutton & Barto](/tags/sutton-and-barto) and in the repository [dloranc/reinforcement-learning-an-introduction](https://github. com/dloranc/reinforcement-learning-an-introduction).*

---
In [last post](/2017/04/29/attack-of-multi-armed-bandits) I discussed the basic version of multi-armed bandit with $\epsilon$-greedy strategy. The presented algorithm has a small drawback, as it requires recording each reward and calculating the arithmetic mean of the rewards for a given action each time the best action is selected. Not only does the algorithm require memory for rewards, as many times as there are time steps, but each time it is necessary to choose the best action, a lot of unnecessary and quite time-consuming calculations take place. Let's imagine that we have to calculate the arithmetic mean of one million prizes. How long will it take? This can be solved better.

<!-- truncate -->

## Optimization
Let's recall what the current code looks like:
```python
def __init__(self, arms, pulls, epsilon):
    # ...
    self.rewards = [[] for _ in xrange(self.arms)]

def get_means(self):
    means = np.zeros(self.arms)

    for index, action_rewards in zip(range(len(means)), self.rewards):
        if len(action_rewards) > 0:
            means[index] = sum(action_rewards) / len(action_rewards)

    return means

def save_reward(self, action, reward):
    self.rewards[action].append(reward)
```
You can see that it counts every time. You can separate the 'means' variable here as a class field, and write new action values ​​to it when a new reward arrives. However, then we are left with the matter of calculating the arithmetic mean itself, which is computationally and memory expensive if we were to calculate it for the new prize and all the old ones.

Ok, time for some math. Let's define the value of a stock as $Q_n$ after it has been selected $n - 1$ times:

$$
\begin{align}
Q_n \doteq \frac{R_1 + R2 + \dots + R_{n - 1}}{n - 1}
\end{align}
$$

And let's transform it into a better version:

$$
\begin{align}
Q_{n+1} = \frac{1}{n}\sum_{i=1}^{n}R_i \\
= \frac{1}{n}\left(R_n + \sum_{i = 1}^{n - 1} R_i\right) \\
= \frac{1}{n}\left(R_n + \left(n - 1\right)\frac{1}{n - 1} \sum_{i = 1}^{n - 1} R_i\right) \\
= \frac{1}{n}\left(R_n + \left(n - 1\right)Q_n\right) \\
= \frac{1}{n}\left(R_n + nQ_n - Q_n\right) \\
= Q_n + \frac{1}{n}\left[R_n - Q_n\right]
\end{align}
$$

As you can see, we no longer need to remember all the rewards. Just remember the last value of $Q_n$ and $n$ for each action.

## The code

In the constructor, we get rid of `self.rewards = [[] for _ in xrange(self.arms)]` in favor of `self.rewards = np.zeros(self.arms)` and add `action_count` (our $n$ to remember):
```python
def __init__(self, arms, pulls, epsilon):
    self.action_count = np.zeros(self.arms)
    self.rewards = np.zeros(self.arms)
```

The `save_reward` function looks like this:
```python
def save_reward(self, action, reward):
    # there is another reward, so we increase n by one
    self.action_count[action] += 1
    # calculate Q(A) = Q(A) + 1 / N(A)[R - Q(A)]
    self.rewards[action] = self.rewards[action] + \
        1. / self.action_count[action] * \
        (reward - self.rewards[action])
```

## Summary
It was very simple. The entire script is in [repository](https://github.com/dloranc/reinforcement-learning-an-introduction/blob/master/01_multi_arm_bandits/02_incremental.py) along with the first one, which is not very optimal. After this code modification, it is worth comparing the execution times of both scripts `01_simple.py` and `02_incremental.py` from the repository. To do this you need to use the `time` command. Let's check, both scripts contain quite a time-consuming experiment with a large number of calculations.

```shell
$ time python 01_simple.py

real    2m10.297s
user    2m3.564s
sys     0m0.436s
```

```shell
$ time python 02_incremental.py

real    0m57.918s
user    0m57.268s
sys     0m0.304s
```

As you can see, the difference is significant. That's it for now, the next post will be about multi-armed bandit in the non-stationary version.
