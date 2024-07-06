---
title: Docker na Windowsie - problemy z volumes, symlinkami i połączeniem
tags:
  - Problemy
  - docker
image: images/posts_thumbnails/docker_on_windows_problems_with_volumes_symlinks_and_connection.png
description: Zacząłem się niedawno uczyć Dockera (wiem, późno trochę) i napotkałem parę problemów z nim związanych. Niestety, Windows się niezbyt lubi z dockerem.
---

Zacząłem się parę dni temu uczyć dockera. Do tej pory do wirtualizacji korzystałem z Vagranta, ale niezbyt mi siadł. Ale ja nie o tym. Niezbyt jeszcze ogarniam dockera, ale po paru próbach i jednym projekcie stwierdziłem, że to fajna sprawa. Nie zamierzam jednak tworzyć żadnego tutoriala. Zainteresowanych tutorialem zapraszam do skorzystania z [docker-curriculum.com](https://docker-curriculum.com/). Jest całkiem fajny i nieźle tłumaczy podstawy.

Podczas zabaw z dockerem napotkałem parę problemów i o tym będzie ten post.

<!-- truncate -->

## Volumes

Podczas prób pracy z prostym projektem okazało się, że kontener nie widzi plików, mimo że ustawiłem odpowiednie *volumes* w `docker-compose.yml`. Próba odpalenia *basha* w kontenerze z ustawionym czymś w rodzaju `-v "$PWD/":/var/www/html` też się nie powiodła. Okazało się, że [problemem jest Windows](https://docs.docker.com/compose/gettingstarted/#step-6-re-build-and-run-the-app-with-compose). Jako, że nie mogę korzystać z *Hyper-V*, bo nie posiadam *Windows 10 Professional* muszę korzystać z *Docker Toolbox*. Po dwóch godzinach kombinowania okazało się, że w dockerze pliki są widoczne tylko jeśli są w którymś podkatalogu `c:\Users`. Tak jakoś działa VirtualBox, że tak zrobili. Na zwykłym dockerze dla Windowsa [w dokumentacji](https://docs.docker.com/docker-for-windows/#shared-drives) widziałem, że można w GUI załatwić sprawę poprzez udostępnienie każdej partycji. Czy jakoś tak, średnio mnie to obchodzi.

Zastanawia mnie jedna rzecz. Skoro korzysta się z kontenerów, by mieć odizolowane środowisko, to może powinno to dotyczyć w jakiś sposób systemów plików? Bo tak to izolacja nie jest pełna.

## Symlinki

Druga sprawa jest także związana z Windowsem. Otóż po wywołaniu w kontenerze komendy:

```bash
npm install <nazwa_pakietu> --save-dev
```

NPM rzuca coś w rodzaju:

```bash
npm ERR! code EPROTO
npm ERR! errno -71
npm ERR! syscall symlink
npm ERR! EPROTO: protocol error, symlink '../uglify-js/bin/uglifyjs' -> 'var/www/html/node_modules/.bin/uglifyjs'
```

No tak, nie da się zrobić symlinków w kontenerze, bo docker tego nie ogarnia, mimo tego że na Windowsie da się robić symlinki (tak zwane `junction`). Rozwiązaniem okazało się dodanie przełącznika `--no-bin-links` do komendy:

```bash
npm install <nazwa_pakietu> --save-dev --no-bin-links
```

Gorzej, że to najprawdopobniej nie zadziała w innych przypadkach, więc będę musiał znaleźć jakiś inny sposób.

Może zainstaluję w końcu tego Linuksa? :-)


## Problem z połączeniem

Ha, przy próbie zainstalowania `gulp-uglify` wyskoczyło mi także coś takiego:

```bash
error request to https://registry.npmjs.org/gulp-uglify failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org:443
```

Oczywiście, wcześniej wszystko działało jak trzeba. Połączenie z internetem działało. Rozwiązaniem okazało się zrestartowanie maszyny wirtualnej:

```bash
docker-machine restart
```

I do tego musiałem postawić kontenery za pomocą `docker-compose`:

```bash
docker-compose start
```
