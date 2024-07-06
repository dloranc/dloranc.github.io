---
title: Zapisywanie modeli i historii w Kerasie

tags:
    - Przepisy
    - DSP2017
    - keras
image: power.jpg
description: Post o zapisywaniu modeli i historii w Kerasie, a także o przerywaniu wykonywania skryptu.
---
Przeważnie trenowanie sieci neuronowych trwa bardzo długo. Czasem trzeba przerwać wykonywanie skryptu, gdy chcemy zrobić coś innego, a równie wymagającego zasobów albo wyłączyć komputer. Ja nie lubię zostawiać sprzętu na noc, więc przerywam uczenie sieci neuronowej i wznawiam trenowanie następnego dnia.

Postanowiłem zatem napisać kod umożliwiający przerwanie wykonywania skryptu, a także zapisywanie historii, dzięki czemu mam ją potem dla wszystkich wykonań skryptu, a nie tylko ostatniego. Do tego jeszcze postanowiłem, że obliczenia będą trwać tyle epok ile sobie założyłem.

Skrypt wygląda następująco i jest on przeróbką przykładu z [repozytorium Kerasa](https://github.com/fchollet/keras/blob/master/examples/mnist_mlp.py).

Ok, czas na kod. Zaczynamy od importów:

```python
import os
import keras
import cPickle
from keras.callbacks import Callback
from keras.models import load_model
# other imports
```

Następnie utworzyłem klasę MyHistory, która zapisuje na końcu każdej epoki `accuracy`, `validation accuracy`, `loss` i `validation loss`. Stworzyłem ją dlatego, że potrzebowałem wyciągnąć historię z modelu, gdy skrypt zostaje przerwany (rzucany jest wyjątek KeyboardInterrupt). Innego sposobu nie znalazłem. Możliwe, że dałoby się to jakoś prościej zrobić.

```python
class MyHistory(Callback):
    def __init__(self):
        super(Callback, self).__init__()
        self.history = {'acc': [], 'loss': [], 'val_acc': [], 'val_loss': []}

    def on_epoch_end(self, batch, logs={}):
        for key in self.history.keys():
            self.history[key].append(logs.get(key))
```

Następnie utworzyłem trzy funkcje:

- `load_history` &mdash; funkcja, która wczytuje poprzednią zapisaną na dysku historię za pomocą biblioteki `cPickle`
- `save_history` &mdash; funkcja, która zapisuje historię (też za pomocą `cPickle`)
- `merge_history` &mdash; funkcja, która scala poprzednią historię z tą nową


```python
def load_history(filename):
    with open(filename, 'r') as file:
        history = cPickle.load(file)

    return history

def save_history(history):
    with open('history.pkl', 'wb') as file:
        cPickle.dump(history, file)

def merge_history(previous, current):
    history = { key: previous[key] + current[key] for key in current.keys() }
    return history
```

Następnie, jeśli istnieje model, to go wczytuję. Wczytuję także poprzednią historię, obliczam na podstawie poprzedniej historii ile epok zostało już wykonanych i uruchamiam obliczenia, gdy zostały jeszcze jakieś. Przerywanie skryptu realizuję poprzez obsłużenie wyjątku `KeyboardInterrupt`.

```python
batch_size = 128
num_classes = 10
epochs = 40

# data loading and preprocessing here

if os.path.isfile('my_model.h5'):
    print('Loading model...')
    model = load_model('my_model.h5')
else:
    # model definition and compilation here

previous_history = None

if os.path.isfile('history.pkl'):
    previous_history = load_history('history.pkl')

previous_epochs = 0

if previous_history is not None:
    previous_epochs = len(previous_history['acc'])

epochs = epochs - previous_epochs

my_history = MyHistory()
history = None

try:
    if epochs > 0:
        history = model.fit(x_train, y_train,
                            batch_size=batch_size, epochs=epochs,
                            verbose=1, validation_data=(x_test, y_test),
                            callbacks=[my_history])
    else:
        print('Training completed.')
except KeyboardInterrupt:
    print()
    print('You pressed CTRL+C')
    history = my_history.history
finally:
    model.save('my_model.h5')
```

Na samym końcu scalam i zapisuję historię:

```python
    if history != None and type(history) is not dict:
        history = history.history

    if previous_history != None and history != None:
        history = merge_history(previous_history, history)

    if history != None and len(history['acc']) > 0:
        save_history(history)
```

## Podsumowanie

W powyższym skrypcie udało się osiągnąć zapisywanie modelu i historii, dzięki czemu będę mógł przerywać obliczenia w dowolnym momencie. Do sprawdzenia pozostaje mi tylko to czy  przy restarcie `val_loss` jest brane z zapisanego modelu, czy zaczyna się od pierwszego w danym wykonaniu skryptu. To jest problem, bo jeśli wznowiony skrypt zaczyna od nowa, to stara wartość jest tracona i jeśli do końca obliczeń zostało niewiele, to może dojść do takiej sytuacji gdzie kończymy z modelem z gorszymi wagami niż powinniśmy.

Przykład z działającym kodem można znaleźć [tutaj](https://gist.github.com/dloranc/d7b7fbeb138e192916a7ae3a793ea477).
