---
title: KFold i StratifiedKFold

tags:
    - Przepisy
    - scikit-learn
image: kfold_stratifiedkfold.png
description: Krótka notka o wykorzystaniu KFold i StratifiedKFold z biblioteki <strong>scikit-learn</strong> do dzielenia zbioru danych.

---
Jako, że jestem nadal dość początkującą osobą w świecie Pythona i jego bibliotek, a zwłaszcza tych związanych z uczeniem maszynowym, to wiele rzeczy jest dla mnie nieznanych. Takim przykładem jest dzielenie zbioru danych na części do treningu i do cross validation. Dotychczas robiłem to po swojemu, ale po co tak robić skoro mamy od tego inne narzędzia?

Dlatego zacząłem korzystać z narzędzi dostarczanych przez bibliotekę __scikit-learn__ takich jak `KFold` i `StratifiedKFold`.

## Przykład z __KFold__:

```python
#!/usr/bin/python2.7

from __future__ import print_function

import numpy as np
from sklearn.cross_validation import KFold

X = np.array([[1, 2], [3, 4], [1, 2], [3, 4]])
y = np.array([0, 0, 1, 1])
kf = KFold(len(X), n_folds=2, shuffle=True)

train_index, test_index = next(iter(kf))

X_train, X_test = X[train_index], X[test_index]
y_train, y_test = y[train_index], y[test_index]
print("TRAIN X:", X_train)
print("TEST X:", X_test)
print("TRAIN y:", y_train)
print("TEST y:", y_test)
```


Na wyjściu otrzymamy:

```python
TRAIN X: [[1 2]
 [1 2]]
TEST X: [[3 4]
 [3 4]]
TRAIN y: [0 1]
TEST y: [0 1]
```

Albo na przykład:

```python
TRAIN X: [[1 2]
 [3 4]]
TEST X: [[1 2]
 [3 4]]
TRAIN y: [0 0]
TEST y: [1 1]
```


Na powyższym przykładzie widać, że po przeprowadzeniu podziału na dwa zbiory może dojść do takiej sytuacji, że w zbiorze treningowym albo testowym będą dane należące do tylko jednej klasy. KFold nie zapewnia równomiernego rozkładu klas. Aby temu zapobiec można skorzystać z StratifiedKFold, który zapewnia równomierny rozkład klas w każdym zbiorze.

## Przykład z __StratifiedKFold__:

```python
#!/usr/bin/python2.7

from __future__ import print_function

import numpy as np
from sklearn.cross_validation import StratifiedKFold

X = np.array([[1, 2], [3, 4], [1, 2], [3, 4]])
y = np.array([0, 0, 1, 1])
skf = StratifiedKFold(y, n_folds=1)

train_index, test_index = next(iter(skf))

X_train, X_test = X[train_index], X[test_index]
y_train, y_test = y[train_index], y[test_index]

print("TRAIN X:", X_train)
print("TEST X:", X_test)
print("TRAIN y:", y_train)
print("TEST y:", y_test)
```

Więcej o `KFold` i `StratifiedKFold` można poczytać w dokumentacji __scikit-learn__:

[KFold](http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.KFold.html)

[StratifiedKFold](http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedKFold.html)
