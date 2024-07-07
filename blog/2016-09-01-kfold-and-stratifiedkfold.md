---
title: KFold i StratifiedKFold
tags:
    - recipes
    - scikit_learn
image: images/posts_thumbnails/kfold_stratifiedkfold.png
description: A short note about using KFold and StratifiedKFold from the <strong>scikit-learn</strong> library to split a data set.

---
As I am still quite a beginner in the world of Python and its libraries, especially those related to machine learning, many things are unknown to me. An example of this is dividing the data set into parts for training and cross validation. So far, I've done it my own way, but why do it this way when we have other tools for it?

<!-- truncate -->

Therefore, I started using tools provided by the __scikit-learn__ library such as `KFold` and `StratifiedKFold`.
## Example with __KFold__:

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


At the output we will get:

```python
TRAIN X: [[1 2]
 [1 2]]
TEST X: [[3 4]
 [3 4]]
TRAIN y: [0 1]
TEST y: [0 1]
```

Or for example:

```python
TRAIN X: [[1 2]
 [3 4]]
TEST X: [[1 2]
 [3 4]]
TRAIN y: [0 0]
TEST y: [1 1]
```

The above example shows that after dividing into two sets, a situation may arise that the training or test set will contain data belonging to only one class. KFold does not ensure an even distribution of classes. To prevent this, you can use StratifiedKFold, which ensures an even distribution of classes in each set.

## Example with __StratifiedKFold__:

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

You can read more about `KFold` and `StratifiedKFold` in the __scikit-learn__ documentation:

[KFold](http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.KFold.html)

[StratifiedKFold](http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedKFold.html)
