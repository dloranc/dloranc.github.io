---
title: OneHotEncoder

tags:
    - recipes
    - scikit_learn
image: images/posts_thumbnails/one_hot_encoder.jpg
description: Because the most important thing is hot ones.
---
This post is a continuation of a previous post about [LabelEncoder](/2016/09/10/label-encoder). This time it will be about a technique called __one hot encoding__ or [one-hot](https://en.wikipedia.org/wiki/One-hot). Having categories converted into corresponding numbers, we can also convert them into several columns (the number of columns depends on how many categories there are), which contain zeros and ones, respectively, denoting whether a row belongs to a category or not. We use this method when we use an algorithm that may have a problem with numeric variables (because they assume some order).

<!-- truncate -->

Suppose we have a category "color" with three possible values: red, green, blue.

| Variable | Color |
| -------- | ------|
| 1        | red   |
| 2        | green |
| 3        | blue  |
| 4        | green |
| 5        | red   |

After coding the labels, red will be converted to zero, green will be converted to two, and blue will be converted to one (the __scikit-learn__ library internally sorts this data somehow, and only to these sorted data it assigns the appropriate number).

| Variable | Color |
| -------- | ------|
| 1        | 0     |
| 2        | 2     |
| 3        | 1     |
| 4        | 2     |
| 5        | 0     |

We process this data using the one hot encoding technique:

| Variable | Red | Green | Blue |
| -------- | ----| ------| -----|
| 1        | 1   | 0     | 0    |
| 2        | 0   | 0     | 1    |
| 3        | 0   | 1     | 0    |
| 4        | 0   | 0     | 1    |
| 5        | 1   | 0     | 0    |

```python
#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

from __future__ import print_function

import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder

np.set_printoptions(threshold=np.inf)


X = np.array(['red', 'green', 'blue', 'green', 'red'])

lbl_enc = LabelEncoder()
lbl_enc.fit(X)
X_cat = lbl_enc.transform(X)

print(X_cat)

# here we change a one-dimensional array to a two-dimensional one, because the script throws an error
X_cat = X_cat.reshape(-1, 1)

encoder = OneHotEncoder()
encoder.fit(X_cat)
X_cat = encoder.transform(X_cat)
X_cat = X_cat.toarray()

print()
print(X_cat)
```

At the output we get:

```python
[0 2 1 2 0]

[[ 1.  0.  0.]
 [ 0.  0.  1.]
 [ 0.  1.  0.]
 [ 0.  0.  1.]
 [ 1.  0.  0.]]
```
