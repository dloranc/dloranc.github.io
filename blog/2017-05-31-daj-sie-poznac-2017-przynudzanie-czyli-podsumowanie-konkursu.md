---
title: Daj Się Poznać 2017 - przynudzanie, czyli podsumowanie konkursu
tags:
    - organizational_matters
    - dsp2017
image: images/posts_thumbnails/daj_sie_poznac_2017_competition_sum.jpg
description: Jak w tytule, czas podsumować mój udział w konkursie Daj Się Poznać 2017. Co się udało? Co nie? Co dalej?
---
Ech, miałem napisać posta o projekcie, ale nie wyrobiłbym się za nic w świecie, więc postanowiłem zrobić to co reszta uczestników, czyli podsumować konkurs i mój udział w nim. Przepraszam, jednak będę przynudzał :)

<!-- truncate -->

## Projekt - historia rozwoju
Może nie pamiętacie, ale w ramach konkursu postanowiłem rozwijać projekt bota do Starcrafta 2 wykorzystującego reinforcement learning. To nie był zbytnio mądry pomysł, bo nie było wtedy API do tworzenia botów, a ja naiwnie założyłem, że Blizzard wraz z DeepMindem się wyrobią na ten *first quarter of 2017*. Nie wyrobili się, API będzie dostępne dopiero latem. Nie wiedziałem co robić, najpierw wymyśliłem, że stworzę w Phaserze (taki framework do pisania gier w Javie w wersji Script) własnego, uproszczonego Starcrafta. Coś tam nawet napisałem, jest to w jednym repozytorium ([dloranc/simple-rts-and-rl-example](https://github.com/dloranc/simple-rts-and-rl-example)), ale szybko się zniechęciłem. Za dużo z tym zabawy. Musiałbym pisać takie rzeczy jak path-finding, a mi się to nie uśmiechało za bardzo. Ostatecznie porzuciłem ten projekt, ale możliwe, że jednak coś zrobię z tym w najbliższym czasie, jakiś prosty przykład z reinforcement learningiem.

Ostatecznie postanowiłem wziąć się za Starcraft: Brood War, poprzednika Starcrafta 2. Skleciłem dość szybko w Javie, wykorzystując BWAPI i BWMirror prostego bota wykonującego bardzo prostą strategię znaną jako *5 pool*. Bota zgłosiłem do turnieju/laddera SSCAIT. O dziwo, radzi sobie na ladderze nawet nieźle jak na jego prostotę. Jego rezultaty można obejrzeć na stronie z [wynikami](http://sscaitournament.com/index.php?action=scores). Bot ten znajduje się w repozytorium [dloranc/five-pool-bot](https://github.com/dloranc/five-pool-bot).

Bota w akcji można obejrzeć tutaj:

<iframe src="https://www.youtube.com/embed/xvI2EuLPg6o" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

Po napisaniu tego bota planowałem użyć RL, ale okazało się, że BWMirror jest tylko 32-bitowy, więc nie mogłem wykorzystać javowych bibliotek, bo są one tylko 64-bitowe. Musiałbym bota przepisać z BWMirrora na coś innego. Nie chciało mi się za bardzo, więc postanowiłem przerzucić się na TorchCrafta, bibliotekę umożliwiającą rozwijanie botów wykorzystujących uczenie maszynowe. Walczę z tym do dzisiaj i nie jest lekko, bo ta biblioteka praktycznie nie ma dokumentacji.

Łącznie do projektu stworzyłem aż cztery repozytoria. Commitów było łącznie 103, czyli raczej tak sobie. Żałuję też tego, że nic mi się nie udało zrobić z uczeniem maszynowym.

Wszystkie projekty będę rozwijał dalej, może poza tym z 5 poolem, bo jest ukończony i niewiele można tam dodać.

## Reszta bloga
Z pozostałych postów jestem nawet w miarę zadowolony. W trakcie konkursu zacząłem serię postów o reinforcement learningu bazujących na czytanej przeze mnie książce Reinforcement Learning: An Introduction (Richard S. Sutton i Andrew G. Barto). Wszystkie można znaleźć pod tagiem [Sutton & Barto](/tagi/sutton-and-barto), a repozytorium z przykładami to [dloranc/reinforcement-learning-an-introduction](https://github.com/dloranc/reinforcement-learning-an-introduction). Idzie mi to nawet nieźle, ale wydaje mi się, że trochę słabo to wszystko tłumaczę. Tutaj jest sporo do poprawy. Pomysł na zaczęcie tej serii był dobry, wcześniej w trakcie konkursu miałem problemy z doborem tematów. Nie miałem pomysłów na posty, ale teraz wystarczy jechać rozdziały z tej książki i jest dobrze :)

## Co mi dał konkurs?
Od czego by tu zacząć... Nauczyłem się w miarę szybko tworzyć posty. Nic, dziwnego, pisali, że człowiek wyrabia się pisząc i to jest prawda. Nie powiem jednak, że moje posty są dobre, bo jak wyżej pisałem, mam problem z tłumaczeniem rzeczy prosto. Za bardzo komplikuję niektóre rzeczy. Tutaj czeka mnie wiele treningu, będę musiał przejrzeć moje posty i zastanowić się co da się napisać lepiej i prościej.

Druga sprawa, udało mi się pisać w miarę regularnie. Z tym zawsze miałem problem. Tutaj się przyznam, że brałem udział w pierwszej edycji "Daj Się Poznać", tej, w której nie było nawet stu uczestników. Poległem wtedy po dwóch postach. To była tragedia. Dotrwałem jednak do końca tegorocznej edycji i to uważam za sukces. Pisanie i rozwój projektu było niesamowicie czasochłonne, ale się udało i z tego jestem zadowolony.

## Czy dałem się poznać?
Heh, nie bardzo. Co prawda, jakieś tam zainteresowanie moim botem było na początku i parę osób nawet skomentowało, ale od dłuższego czasu nic się na moim blogu nie dzieje :) Analytics też wiele nie pokazuje. Najwięcej sesji miałem 38, mniej więcej w połowie konkursu. Niby się coś tam promowałem na Twitterze i Wykopie, ale ostatni miesiąc był słaby. Prawdę mówiąc, to myślałem, że będzie gorzej.

## Podziękowania

Na koniec chciałbym podziękować organizatorowi Maciejowi Aniserowiczowi za organizację tego konkursu. Przy okazji przepraszam za mojego RSS-a :) Dziękuję także czytelnikom tego bloga (są jacyś?) za czytanie moich wypocin (ale komentujcie częściej!). Dziękuję także uczestnikom konkursu za dzielenie się wiedzą, za integrację na Slacku i za naśmiewanie się z DK :)
