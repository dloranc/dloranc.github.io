---
title: Saving models and history in Keras

tags:
    - recipes
    - dsp2017
    - keras
image: images/posts_thumbnails/power.jpg

description: Post about saving models and history in Keras, as well as interrupting script execution.
---
Usually, training neural networks takes a very long time. Sometimes you need to interrupt the execution of a script when you want to do something else that is equally resource-demanding or turn off the computer. I don't like leaving my PC overnight, so I stop training the neural network and resume training the next day.

<!-- truncate -->

So I decided to write code that would allow me to interrupt the execution of the script and also save the history so that I would have it for all script executions, not just the last one. In addition, I decided that the calculations would take as many epochs as I had planned.

The script looks as follows and is a modification of the example from the [Keras repository](https://github.com/fchollet/keras/blob/master/examples/mnist_mlp.py).

Ok, time for the code. We start with imports:

```python
import os
import keras
import cPickle
from keras.callbacks import Callback
from keras.models import load_model
# other imports
```

Then I created a MyHistory class that writes `accuracy`, `validation accuracy`, `loss` and `validation loss` at the end of each epoch. I created it because I needed to extract the history from the model when the script is interrupted (the KeyboardInterrupt exception is thrown). I haven't found any other way. It's possible that this could be done in a simpler way.

```python
class MyHistory(Callback):
    def __init__(self):
        super(Callback, self).__init__()
        self.history = {'acc': [], 'loss': [], 'val_acc': [], 'val_loss': []}

    def on_epoch_end(self, batch, logs={}):
        for key in self.history.keys():
            self.history[key].append(logs.get(key))
```

Then I created three functions:

- `load_history` &mdash; a function that loads the previous history saved to disk using the `cPickle` library
- `save_history` &mdash; a function that saves history (also with `cPickle`)
- `merge_history` &mdash; a function that merges the previous history with this new one


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

Then, if the model exists, I load it. I also load the previous history, calculate based on the previous history how many epochs have already been completed and run the calculations when there are still some epochs left. I interrupt the script by handling the `KeyboardInterrupt` exception.

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

At the very end I merge and save the history:

```python
    if history != None and type(history) is not dict:
        history = history.history

    if previous_history != None and history != None:
        history = merge_history(previous_history, history)

    if history != None and len(history['acc']) > 0:
        save_history(history)
```

## Summary

The above script managed to save the model and history so that I can stop the calculations at any time. The only thing I need to check is whether when restarting `val_loss` is taken from the saved model or whether it starts from the first script in a given execution. This is a problem because if the restarted script starts over, the old value is lost and if there is little left to the end of the calculations, a situation may arise where we end up with a model with worse weights than we should.

An example with working code can be found [here](https://gist.github.com/dloranc/d7b7fbeb138e192916a7ae3a793ea477).
