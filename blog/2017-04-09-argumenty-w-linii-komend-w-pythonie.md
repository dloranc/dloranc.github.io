---
title: Argumenty w linii komend w Pythonie

tags:
    - DSP2017
    - python
image: python_arguments.png
description: Post o tym jak zrealizować obsługę argumentów przekazywanych do pythonowego skryptu z poziomu linii komend. Wykorzystałem do tego bardzo interesującą bibliotekę o nazwie docopt.
---
Zastanawiałem się ostatnio jak zrealizować w Pythonie obsługę argumentów przekazywanych do skryptu z poziomu linii komend. Można zrobić to bardzo prosto używając `sys.argv` ze biblioteki standardowej:

```python
import sys

if __name__ == '__main__':
	print "\n".join(sys.argv)
```

Powyższy przykład wyświetla argumenty jeden pod drugim. Wyrażenie warunkowe `if __name__ == '__main__':` sprawdza czy skrypt został wywołany w konsoli. Jeśli skrypt został zaimportowany w innym pliku, to wtedy kod się nie wykona.

![sys.argv](/images/posts/python_command_line_arguments/01.png "sys.argv")

## docopt - czyli zaprzęgamy docstringi do pracy

`sys.argv` nie pozwala jednak na wiele. Trzeba samemu zadbać o poprawną obsługę argumentów, a jeśli chcemy mieć pomoc (przy wywołaniu skryptu z --help) do naszego skryptu, to musimy pamiętać o jej zgodności z resztą kodu. Do prostych rzeczy `sys.argv` jednak wystarczy. Jeśli jednak chcemy zbudować narzędzie, które będzie intensywnie wykorzystywane w miejscu, które programiści lubią najbardziej (czyli w konsoli), to musimy skorzystać z czegoś innego. Dość popularnym rozwiązaniem jest `argparse`. Ja skorzystałem jednak z narzędzia `docopt`, które wydaje mi się dość interesujące, gdyż argumenty buduje się za pomocą docstringa. Fajna sprawa.

Zaczynamy od instalacji narzędzia:

```bash
pip install docopt
```

Napiszmy coś prostego, niech będzie to skrypt sumujący liczby. Na razie jednak nie sumujemy, zobaczymy z czym mamy do czynienia.

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

Z zawartości docstringa łatwo się domyślić co wywołać i z jakimi argumentami mamy do czynienia. Nawiasy trójkątne oznaczają argumenty, myślniki (dwa lub jeden) to opcje, a trzy kropki oznaczają to, że argumenty mogą się powtarzać. Nawiasy w połączeniu z pionową kreską natomiast oznaczają wzajemnie wykluczające się opcje.

Czas na testy, wywołajmy `--version` i `--help`:

![python sum.py --version](/images/posts/python_command_line_arguments/02.png "python sum.py --version, wynik: Sum 1.0")

![python sum.py --help](/images/posts/python_command_line_arguments/03.png "python sum.py --help")

Sprawdźmy co się stanie jak wywołamy z argumentami `1 2 3 4`:

![python sum.py 1 2 3 4](/images/posts/python_command_line_arguments/04.png "python sum.py 1 2 3 4, wynik: słownik z argumentami i opcjami")

Widzimy, że zawartością zmiennej `arguments` jest słownik zawierający trzy pola `--help`, `--version` i `<numbers>`.

Dobra, zmodyfikujmy trochę kod, tym razem zsumujmy te liczby.

```python
if __name__ == '__main__':
    arguments = docopt(__doc__, version='Sum 1.0')

    numbers = arguments['<numbers>']

    # trzeba zrzutować na inty bo mamy do czynienia z listą w postaci ['1', '2', '3', '4']
    numbers = list(map(int, numbers))

    print(sum(numbers))
```

Wyświetli się:

![python sum.py 1 2 3 4](/images/posts/python_command_line_arguments/05.png "python sum.py 1 2 3 4, wynik: 10")

Jak widać, biblioteka `docopt` jest bardzo prosta w użyciu. Nie trzeba się bawić w grzebanie w dokumentacji jak w przypadku `argparse` i tym podobnych bibliotek.

Więcej szczegółów na temat `docopt` można znaleźć na stronie [http://docopt.org/](http://docopt.org/).
