---
title: OneHotEncoder

tags:
    - Przepisy
    - scikit-learn
image: images/posts_thumbnails/one_hot_encoder.jpg
description: Bo grunt to gorące jedynki :)
---
Ten wpis jest kontynuacją poprzedniego wpisu o [LabelEncoder](/2016/09/10/label-encoder). Tym razem będzie o technice zwanej __one hot encoding__ albo [kod 1 z n](https://pl.wikipedia.org/wiki/Kod_1_z_n). Mając kategorie zamienione na odpowiadające im liczby możemy zamienić je także na kilka kolumn (ich liczba zależy od tego ile jest kategorii), które zawierają zera i jedynki oznaczające odpowiednio czy dany wiersz należy do kategorii czy nie. Metodę tę stosujemy, gdy używamy algorytmu, który może mieć problem ze zmiennymi liczbowymi (bo zakładają jakiś porządek).

<!-- truncate -->

Przypuśćmy, że mamy kategorię "kolor" z trzema możliwymi wartościami: czerwony, zielony, niebieski.

| Zmienna | Kolor     |
| ------- | --------- |
| 1       | czerwony  |
| 2       | zielony   |
| 3       | niebieski |
| 4       | zielony   |
| 5       | czerwony  |

Po zakodowaniu etykiet czerwony będzie zamieniony na zero, zielony na dwójkę, a niebieski na jedynkę (biblioteka __scikit-learn__ wewnętrznie sobie jakoś sortuje te dane i dopiero tym posortowanym danym przypisuje odpowiedni numer).

| Zmienna | Kolor     |
| ------- | --------- |
| 1       | 0         |
| 2       | 2         |
| 3       | 1         |
| 4       | 2         |
| 5       | 0         |

Przetwarzamy te dane za pomocą techniki one hot encoding:


| Zmienna | Czerwony  | Zielony | Niebieski |
| ------- | --------- | ------- | --------- |
| 1       | 1         | 0       | 0         |
| 2       | 0         | 0       | 1         |
| 3       | 0         | 1       | 0         |
| 4       | 0         | 0       | 1         |
| 5       | 1         | 0       | 0         |

```python
#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

from __future__ import print_function

import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder

np.set_printoptions(threshold=np.inf)


X = np.array(['czerwony', 'zielony', 'niebieski', 'zielony', 'czerwony'])

lbl_enc = LabelEncoder()
lbl_enc.fit(X)
X_cat = lbl_enc.transform(X)

print(X_cat)

# tutaj zmieniamy jednowymiarową tablicę na dwuwymiarową, bo skrypt rzuca błędem
X_cat = X_cat.reshape(-1, 1)

encoder = OneHotEncoder()
encoder.fit(X_cat)
X_cat = encoder.transform(X_cat)
X_cat = X_cat.toarray()

print()
print(X_cat)
```

Na wyjściu otrzymujemy:

```python
[0 2 1 2 0]

[[ 1.  0.  0.]
 [ 0.  0.  1.]
 [ 0.  1.  0.]
 [ 0.  0.  1.]
 [ 1.  0.  0.]]
```
