---
title: LabelEncoder

tags:
    - recipes
    - scikit_learn
image: images/posts_thumbnails/label_encoder.png
description: A simple way to convert data in categorical variables to numeric data using the label encoding method.
---
Czasami, przetwarzając zbiór danych, mamy do czynienia ze zmiennymi, które są typu tekstowego i przyporządkowują obserwację statystyczną do jakiejś kategorii. Przykładowo, mamy do czynienia z uczniami pewnej szkoły, którzy chodzą do różnych klas (1A, 1B, 1C, 2A, 2B, 2C itd.). Chcemy takie zmienne zamienić na liczby w celu ich dalszego przetwarzania przez jakiś wybrany algorytm np. random forest. Można do tego użyć klasy `LabelEncoder` z biblioteki __scikit-learn__.

Sometimes, when processing a data set, we deal with text-type variables that assign a statistical observation to a category. For example, we are dealing with students of a certain school who go to different classes (1A, 1B, 1C, 2A, 2B, 2C, etc.). We want to convert such variables into numbers for further processing by a selected algorithm, e.g. random forest. You can use the `LabelEncoder` class from the __scikit-learn__ library for this.

<!-- truncate -->

```python
#!/usr/bin/python2.7

from __future__ import print_function

import numpy as np
from sklearn.preprocessing import LabelEncoder

X = np.array(['1A', '1B', '1C', '2A', '1A', '3C'])

lbl_enc = LabelEncoder()
lbl_enc.fit(X)
X_cat = lbl_enc.transform(X)

print(X_cat)
```

At the output we get:

```
[0 1 2 3 0 4]
```
