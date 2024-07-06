---
title: Wiedza, wiedza, wiedza

tags:
    - DSP2017
image: books.jpg
description: Dump kilkunastu linków z moich zakładek, które mi się przydadzą w projekcie, a także plany na przyszłość.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Następne tygodnie miną mi pod znakiem blogowania i tworzenia [projektu](https://github.com/dloranc/starcraft-ai) na "Daj Się Poznać 2017". Projekt wymaga rzeczy, których jeszcze zbytnio nie umiem. Dlatego postanowiłem, że ten wpis będzie taką próbą ogarnięcia wszystkiego na czym powinienem się skupić w najbliższym czasie. Mam naprawdę mnóóóóstwo zakładek, szczególnie artykułów z Arxiv, trzeba ogarnąć ten bajzel, zrobić selekcję i zacząć to w końcu czytać i przerabiać :)

<!-- truncate -->

## Książki i kursy

Na pewno będę musiał się w końcu nauczyć reinforcement learningu, zaczynając od tych podstawowych i standardowych metod, a kończąc na aktualnym "state of art".

1. [Reinforcement Learning: An Introduction](http://webdocs.cs.ualberta.ca/~sutton/book/the-book-2nd.html) - na początek będę starał się uczyć z tej ponoć klasycznej pozycji w temacie reinforcement learningu autorstwa Richarda S. Suttona i Andrewa G. Barto.

2. [Kurs Reinforcement Learning na Udacity](https://www.udacity.com/course/reinforcement-learning--ud600) - trzeba to będzie jeszcze raz od początku zacząć i skończyć.

3. [UC Berkeley CS188 Intro to AI](http://ai.berkeley.edu/home.html) - ktoś ze Slacka mi to polecił, nie miałem czasu całości przejrzeć, ale wygląda nawet ciekawie.

Chyba tyle podstaw. Dalej będzie ciekawiej, pozbierałem trochę linków z [r/machinelearning](https://reddit.com/r/MachineLearning/), ich ilość w zakładkach przytłacza, więc wybrałem te moim zdaniem najbardziej istotne:

## Arxiv

1. [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602) - chyba już klasyczna praca o uczeniu sieci neuronowej na podstawie pikseli. Zamierzam jeden z pierwszych modeli mojego bota stworzyć na jej podstawie.

2. [Deep Recurrent Q-Learning for Partially Observable MDPs](https://arxiv.org/abs/1507.06527) - Starcraft jest POMDP, więc ten artykuł się w jakimś stopniu powinien przydać.

3. [Training Agent for First-Person Shooter Game with Actor-Critic Curriculum Learning](https://openreview.net/pdf?id=Hk3mPK5gg) - coś co może mi się przydać, na pewno będę potrzebować jakiejś formy curriculum learningu.

4. [Asynchronous Methods for Deep Reinforcement Learning](https://arxiv.org/abs/1602.01783) - że zacytuję abstrakt: "The best performing method, an asynchronous variant of actor-critic, surpasses the current state-of-the-art on the Atari domain while training for half the time on a single multi-core CPU instead of a GPU". To się na pewno mi przyda, bo nie mam GPU.

5. [PathNet: Evolution Channels Gradient Descent in Super Neural Networks](https://arxiv.org/abs/1701.08734) - świeża praca, trenowanie wielu sieci neuronowych z tranferem wiedzy i ich selekcją za pomocą algorytmu genetycznego.

Do tego oczywiście lista [awesome-deep-reinforcement-learning](https://github.com/williamd4112/awesome-deep-reinforcement-learning).

## Podsumowanie

To na razie tyle, wybrałem to co moim zdaniem najważniejsze. Ten miesiąc spędzę na poznawaniu teorii i tworzeniu prostych modeli w OpenAI Gymie. Co do projektu to w tym tygodniu będę się bawił analizą replayów za pomocą [sc2readera](https://github.com/GraylinKim/sc2reader) i [s2protocol](https://github.com/Blizzard/s2protocol).
