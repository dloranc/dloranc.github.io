---
title: Zależności w Pythonie

tags:
    - recipes
    - dsp2017
    - python
    - pip
    - virtualenv
image: images/posts_thumbnails/python_dependencies.jpg
description: Jako, że nie jestem szczególnie biegły w Pythonie to pewne rzeczy są dla mnie nowością. Tym razem wpis o tym jak wyglądają zależności w Pythonie w porównaniu do innych języków, które znam.
---
Na co dzień w pracy używam JavaScriptu i PHP. W tych językach występują menedżery pakietów `npm` (i nie tylko) i `composer`, które umożliwiają łatwe zarządzanie zależnościami dla każdego projektu. Do tej pory w Pythonie pisałem dość proste skrypty i nie potrzebowałem żadnego menedżera pakietów. W ramach nadchodzących projektów postanowiłem sprawdzić jak wygląda sprawa z zarządzaniem zależnościami w Pythonie.

<!-- truncate -->

## pip (Pip Installs Packages)

Pip jest standardowym menedżerem pakietów w Pythonie. Poniżej przedstawiam listę podstawowych komend.

```bash
pip install <package>           # instalacja pakietu
pip install <package> --upgrade # aktualizacja pakietu
pip uninstall                   # odinstalowuje pakiety
pip list                        # wyświetla listę zainstalowanych pakietów
pip list --outdated             # wyświetla listę nieaktualnych pakietów
pip show                        # wyświetla szczegóły na temat pakietu
pip freeze                      # wyświetla listę zainstalowanych pakietów w formacie plików requirements.txt
pip install -r requirements.txt # instaluje zależności z pliku requirements.txt
```

Tworząc projekt warto podać w pliku requirements.txt listę zależności, które są wymagane by uruchomić projekt. Przykładowy plik requirements.txt wygląda następująco:

```
matplotlib==1.3.1
numpy==1.12.0
scikit-learn==0.18.1
```

Widzimy, że lista zawiera nazwy pakietów i ich wersje oddzielone znakami `==`.

## pipreqs

Co jeśli jednak mamy już jakiś projekt i potrzebujemy utworzyć listę zależności? Czy musimy się bawić w ich wyciąganie z listy otrzymanej za pomocą polecenia `pip freeze`? Z pomocą przychodzi biblioteka `pipreqs`.

Instalujemy ją:

```bash
pip install pipreqs
```

A potem wywołujemy, jako parametr podając katalog z projektem, w którym chcemy dostać listę zależności:

```bash
pipreqs project_directory/
```

## virtualenv

Wszystko fajnie, ale goły `pip` ma jedną poważną wadę - instaluje wszystkie pakiety w przestrzeni globalnej (to tak jakbyśmy użyli `npm install -g <package>`. W przypadku, gdy mamy kilka projektów i te potrzebują do działania różnych wersji tej samej biblioteki mamy problem. Rozwiązaniem jest użycie biblioteki `virtualenv`. Pozwala ona na tworzenie odizolowanych środowisk z Pythonem i zależnościami. Zobaczmy jak to działa.

Aby zainstalować `virtualenv` wpisujemy w konsoli:

```bash
pip install virtualenv
```

Instalacja virtualenv w katalogu projektu:

```bash
virtualenv env            # env to nazwa katalogu, w którym będzie środowisko
virtualenv -p python3 env # jak chcemy Pythona 3
```

Powstanie katalog env. Wylistujmy go:

```shell-session
$ ls env/
bin include lib local pip-selfcheck.json
```

Katalog `env/bin/` zawiera to co nas najbardziej interesuje, czyli lokalną wersję Pythona i pip.

Ok, przetestujmy `virtualenv`. Instalacja biblioteki w `virtualenv` wygląda następująco:

```bash
env/bin/pip install requests
```

Sprawdźmy, czy rzeczywiście to środowisko jest odizolowane od głównego:

```shell-session
$ env/bin/pip list
appdirs (1.4.3)
packaging (16.8)
pip (9.0.1)
pyparsing (2.2.0)
requests (2.13.0)
setuptools (34.3.1)
six (1.10.0)
wheel (0.29.0)
```

## Ułatwienie pracy z virtualenv

Co jeśli nie chcemy ciągle pisać `env/bin/pip` i tym podobnych komend odnoszących się do naszego środowiska?

Najpierw dla celów testowych użyjemy komendy `which` która wyświetla katalog, w którym jest przechowywany uruchamiany program:

```bash
which python
```

Wynikiem wywołania tego polecenia będzie najprawdopodobniej poniższa ścieżka (lub podobna):

```bash
/usr/bin/python
```

Ok, zmieniamy pythona i resztę na tę z naszego utworzonego środowiska:

```bash
source env/bin/activate
```

Powyższa komenda uruchami w bieżącej instancji powłoki skrypt, który podmieni zmienne środowiskowe na te ze środowiska wirtualnego.

Wpisujemy w konsoli jeszcze raz `which python` i otrzymujemy coś w rodzaju:

```bash
/home/Dawid/python_projects/virtualenv_test/env/bin/python
```

Teraz jak wpiszemy w konsoli `python` to uruchomi się Python z naszego odizolowanego środowiska wirtualnego, a nie ten globalny.

Aby wyłączyć środowisko projektu wystarczy wpisać w konsoli `deactivate`.

## Podsumowanie

To tyle, nauczyliśmy się podstawowej obsługi `pip` i `virtualenv`. O tworzenieniu paczek i wysyłaniu ich do PyPI będzie może kiedy indziej. Przyznam się także, że bardzo się zdziwiłem tym, że `pip` nie umożliwia separacji bibliotek dla każdego projektu i potrzebna jest do tego instalacja specjalnej paczki. Dziwne, mam inne doświadczenia jeśli chodzi o PHP i JS. Obstawiam, że to przez jakieś zaszłości historyczne.
