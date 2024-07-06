---
title: Multi-armed bandit - prosta optymalizacja
tags:
    - Sutton & Barto
    - DSP2017
    - python
    - multi-armed-bandit
    - reinforcement-learning
image: multi_armed_bandit_simple_optimization.jpg
description: Post o pewnym sposobie optymalizacji pozwalającym na mniejsze zużycie pamięci i mocy procesora dla algorytmu zaprezentowanego w poprzednim poście o multi-armed bandit problem.
---
*Ten post jest częścią moich zmagań z książką ["Reinforcement Learning: An Introduction"](http://incompleteideas.net/book/the-book.html) autorstwa Richarda S. Suttona i Andrew G. Barto. Pozostałe posty systematyzujące moją wiedzę i prezentujące napisany przeze mnie kod można znaleźć pod tagiem [Sutton & Barto](/tagi/sutton-barto) i w repozytorium [dloranc/reinforcement-learning-an-introduction](https://github.com/dloranc/reinforcement-learning-an-introduction).*

---
W [ostatnim poście](/2017/04/29/atak-wielorekich-bandytow) omówiłem podstawową wersję multi-armed bandit z $\epsilon$-greedy strategy. Zaprezentowany algorytm ma małą wadę, wymaga bowiem zapisywania każdej nagrody i liczenia za każdym razem średniej arytmetycznej nagród dla danej akcji, gdy następuje wybór najlepszej akcji. Nie dość, że algorytm wymaga pamięci na nagrody i to łącznie tyle ile jest kroków czasowych, to jeszcze za każdym razem, gdy potrzebny jest wybór najlepszej akcji następuje sporo tak naprawdę zbędnych i dość czasochłonnych obliczeń. Wyobraźmy sobie, że mamy liczyć średnią arytmetyczną z miliona nagród. Ile to zajmie? Da się to rozwiązać lepiej.

<!-- truncate -->

## Optymalizacja
Przypomnijmy jak wygląda dotychczasowy kod:
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
Widać, że za każdym razem liczy się Można tutaj wydzielić zmienną `means` jako pole klasy, i do niej zapisywać nowe wartości akcji jak dojdzie nowa nagroda. Wtedy jednak zostaje sprawa liczenia samej średniej arytmetycznej, która jest kosztowna obliczeniowo i pamięciowo, gdybyśmy mieli ją liczyć dla nowej nagrody i wszystkich starych.

Ok, czas na trochę matmy. Zdefiniujmy sobie wartość akcji jako $Q_n$ po tym jak została wybrana $n - 1$ razy:

$$
\begin{align}
Q_n \doteq \frac{R_1 + R2 + \dots + R_{n - 1}}{n - 1}
\end{align}
$$

I przekształćmy to w lepszą wersję:

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

Jak widać, nie potrzebujemy już zapamiętywania wszystkich nagród. Wystarczy pamiętać ostatnią wartość $Q_n$ i $n$ dla każdej akcji.

## Kod

W konstruktorze pozbywamy się `self.rewards = [[] for _ in xrange(self.arms)]` na rzecz `self.rewards = np.zeros(self.arms)` i dodajemy `action_count` (nasze $n$ do zapamiętania):
```python
def __init__(self, arms, pulls, epsilon):
    self.action_count = np.zeros(self.arms)
    self.rewards = np.zeros(self.arms)
```

Funkcja `save_reward` wygląda następująco:
```python
def save_reward(self, action, reward):
    # dochodzi kolejna nagroda, więc zwiększamy n o jeden
    self.action_count[action] += 1
    # liczymy Q(A) = Q(A) + 1 / N(A)[R - Q(A)]
    self.rewards[action] = self.rewards[action] + \
        1. / self.action_count[action] * \
        (reward - self.rewards[action])
```

## Podsumowanie
To było bardzo proste. Cały skrypt znajduje się w [repozytorium](https://github.com/dloranc/reinforcement-learning-an-introduction/blob/master/01_multi_arm_bandits/02_incremental.py) razem z tym pierwszym, niezbyt optymalnym. Po tej modyfikacji kodu warto porównać czasy wykonania obu skryptów `01_simple.py` i `02_incremental.py` z repozytorium. Aby to zrobić trzeba użyć komendy `time`. Sprawdźmy, oba skrypty zawierają dość czasochłonny eksperyment z dużą liczbą obliczeń.

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

Jak widać, różnica jest spora. To tyle na razie, następny post będzie o multi-armed bandit w wersji niestacjonarnej.
