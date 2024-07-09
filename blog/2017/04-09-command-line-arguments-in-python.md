---
title: Command line arguments in Python
tags:
    - dsp2017
    - python
image: images/posts_thumbnails/python_arguments.png

description: A post about how to handle arguments passed to a Python script from the command line. For this I used a very interesting library called docopt.
---
Recently I was wondering how to implement arguments passed to the script from the command line in Python. You can do this very simply using `sys.argv` from the standard library:

```python
import sys

if __name__ == '__main__':
	print "\n".join(sys.argv)
```

<!-- truncate -->

The above example displays the arguments one below the other. The conditional expression `if __name__ == '__main__':` checks whether the script was invoked in the console. If the script was imported in another file, then the code will not execute.

![sys.argv](/images/posts/python_command_line_arguments/01.png "sys.argv")

## docopt - we put docstrings to work

`sys.argv` doesn't allow much though. You have to take care of the correct handling of the arguments yourself, and if we want to have help (when calling the script with `--help`) for our script, we must remember to ensure its compatibility with the rest of the code. For simple things, however, `sys.argv` is enough. However, if we want to build a tool that will be intensively used in the place that programmers like best (i.e. in the console), we have to use something else. A quite popular solution is `argparse`. However, I used the `docopt` tool, which seems quite interesting to me because the arguments are built using a docstring. Cool thing.

We start by installing the tool:

```bash
pip install docopt
```

Let's write something simple, let's say it's a script that adds numbers. For now, however, we are not adding up, we will see what we are dealing with.

```python
"""Sum integer values.

Usage:
  sum.py <numbers>...
  sum.py (-h | --help)
  sum.py --version

Options:
  -h --help     Show this screen.
  --version     Show version.

"""
from docopt import docopt


if __name__ == '__main__':
    arguments = docopt(__doc__, version='Sum 1.0')

    numbers = arguments['<numbers>']

    try:
        numbers = list(map(int, numbers))
        print(sum(numbers))
    except ValueError:
        print('Cannot cast value(s) to integer.')
```

From the content of the docstring, it is easy to guess what to call and what arguments we are dealing with. Brackets indicate arguments, dashes (two or one) indicate options, and three dots indicate that arguments may be repeated. Brackets combined with a vertical line indicate mutually exclusive options.

Time for testing, let's call `--version` and `--help`:

![python sum.py --version](/images/posts/python_command_line_arguments/02.png "python sum.py --version, result: Sum 1.0")

![python sum.py --help](/images/posts/python_command_line_arguments/03.png "python sum.py --help")

Sprawdźmy co się stanie jak wywołamy z argumentami `1 2 3 4`:

![python sum.py 1 2 3 4](/images/posts/python_command_line_arguments/04.png "python sum.py 1 2 3 4, result: dictionary with arguments and options")

We see that the content of the `arguments` variable is a dictionary containing three fields `--help`, `--version` and `<numbers>`.

Okay, let's modify the code a bit, this time let's add up these numbers.

```python
if __name__ == '__main__':
    arguments = docopt(__doc__, version='Sum 1.0')

    numbers = arguments['<numbers>']

    # we need to cast it to an int because we are dealing with a list in the form ['1', '2', '3', '4']
    numbers = list(map(int, numbers))

    print(sum(numbers))
```

It will display:

![python sum.py 1 2 3 4](/images/posts/python_command_line_arguments/05.png "python sum.py 1 2 3 4, sum: 10")

As you can see, the `docopt` library is very easy to use. You don't have to mess around with documentation like in the case of `argparse` and similar libraries.

More details about `docopt` can be found at [http://docopt.org/](http://docopt.org/).
