---
title: Instalacja TorchCrafta
tags:
    - projects
    - dsp2017
    - starcraft
    - bwapi
image: images/posts_thumbnails/torchcraft_installing.jpg

description: Co tam u mnie w projekcie? Słabo, męczę się z ustawianiem TorchCrafta, żeby zaczął działać.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Przez cały ten tydzień zastanawiałem się jaką obrać drogę dla mojego projektu bota. Chciałem użyć Deeplearning4j, ale ta biblioteka gryzie się z BWMirrorem, który wymaga Javy 32-Bit. Alternatywą jest przepisanie całego projektu z BWMirrora na JNIBWAPI. Drugą alternatywą jest przepisanie projektu do C++, co mnie średnio interesuje, bo nie czuję się dobrze w tym języku. Znaczy, w Javie też nie, ale pisanie w Javie łatwiej ogarnąć. Postanowiłem jednak wziąć się w końcu za TorchCrafta. Tracę oczywiście możliwość udziału w SSCAIT, ale myślę, że lepiej będzie coś w końcu zrobić związanego z reinforcement learningiem z pomocą gotowego środowiska. Gdybym miał to samo robić w Javie zeszłoby mi z tym naprawdę dużo czasu.

<!-- truncate -->

## Instalacja na Linuksie
Trochę mi zeszło z instalacją Torcha, Lua i TorchCrafta. Jak to bywa, korzystając z instrukcji na [stronie projektu](https://github.com/TorchCraft/TorchCraft/blob/master/docs/user/installation.md) coś nie działało. Po dość długim kombinowaniu co zrobić by wszystko postawić doszedłem do tego, że najlepiej zainstalować Torcha używając instrukcji z [tej strony](http://torch.ch/docs/getting-started.html#_).

Wracając do [opisu instalacji TorchCrafta](https://github.com/TorchCraft/TorchCraft/blob/master/docs/user/installation.md) zamiast:
```bash
git clone git@github.com:torchcraft/torchcraft.git --recursive
```

Trzeba sklonować:
```bash
git clone https://github.com/TorchCraft/TorchCraft.git --recursive
```

## Instalacja na Windowsie
Tutaj było już w miarę prosto, bo całość ograniczyła się do kopiowania plików. Skorzystałem z **BVEnv.exe** z instrukcji.

## Spięcie wszystkiego w całość
Poinstalowałem wszystko. Czas to uruchomić. Na wirtualce Linuksa trzeba odpalić w konsoli:
```bash
th simple_exe.lua -t $server_ip
```
Zamiast **$server_ip** trzeba podstawić IP hosta. Do tego trzeba użyć w Windowsie komendy `ipconfig` i podstawić jeden z adresów, które wyskoczą. Więcej chyba nic nie trzeba robić w Linuksie.

Na Windowsie jest gorzej. Uruchomiłem **BVEnv.exe** i jednej rzeczy nie mogę rozgryźć, a mianowicie po odpaleniu tego pliku wyświetla się coś takiego:
```
Welcome to the Brood War TorchCraft Environment.
Compiled on Mar 18 2017, 07:48:54.
<Config Info>
  loaded: 1
  current path: C:/StarCraft/bwapi-data/torchcraft.ini
general
  port = 0
  log_path = C:/tc_data/torchcraft_log_cpp_port_
  display_log = 0
  img_mode = raw
  window_mode = windows
  window_mode_custom =
  img_save_path = C:/tc_data/output_
starcraft
  assume_on = 0
  launcher = injectory
  custom_launcher =

C:/StarCraft//TorchCraft/\BWEnv\bin\injectory.x86.exe --launch C:/StarCraft/\StarCraft.exe --inject C:/StarCraft/\bwapi-data\BWAPI.dll
While running command:
        00996F98
CreateProcess failed: 2
Connecting...
```

Ścieżka do Starcrafta jest nieprawidłowa, znajduje się on w zupełnie innym miejscu. Nie mogłem dokopać się czy można do tego BWEnv.exe przekazać jakieś argumenty. Z kodu wynika, że czegoś takiego nie ma, więc będę musiał zmienić i przekompilować ten projekt.

## Podsumowanie
Nie udało mi się wiele zrobić w tym tygodniu. Takie życie, zawsze mnie muszą zatrzymać jakieś głupie problemy techniczne. Postaram się jakoś to spiąć w całość w najbliższym czasie. Żeby było śmieszniej to przy javowym projekcie bota też coś się zepsuło, a nic nie zmieniałem w kodzie. Przy próbie kompilacji bota wyskakuje mi jakieś: `Exception in thread "main" java.lang.UnsatisfiedLinkError: \{path\}\bwapi_bridge2_5.dll: Can't find dependent libraries`, mimo że wszystkie DLL-ki są tam gdzie były i wcześniej działało. Jak żyć?

Na pocieszenie muszę powiedzieć, że mój bot mimo prostoty sobie nieźle radzi na ladderze SSCAIT. Osiągnąłem 60%	winratio (39 wygranych,	42 przegranych), co jest moim zdaniem dobrym wynikiem jak na takiego banalnego bota.
