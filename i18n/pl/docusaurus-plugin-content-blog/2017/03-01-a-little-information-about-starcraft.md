---
title: Trochę informacji o Starcrafcie i moje plany

tags:
  - projects
  - dsp2017
  - starcraft
image: images/posts_thumbnails/about_starcraft.jpg

description: Post wyjaśniający trochę rzeczy na temat Starcrafta 2 dla osób, które w tę grę nigdy nie grały. Do tego jeszcze napisałem o moich planach związanych z projektem w ramach "Daj Się Poznać 2017".
---

Pora zacząć, poprzedni post w kategorii "Daj się poznać 2017" był w zasadzie postem potrzebnym do utworzenia kategorii i kanału RSS koniecznego do wzięcia udziału w konkursie. Sculpin, którego używam, wymaga stworzenia jakiegokolwiek postu przypisanego do kategorii by ją wygenerować.

<!-- truncate -->

## Dlaczego Starcraft?

Kilka miesięcy temu firma [DeepMind ogłosiła na BlizzConie](https://deepmind.com/blog/deepmind-and-blizzard-release-starcraft-ii-ai-research-environment), że we współpracy z Blizzardem podjęła pracę nad napisaniem środowiska umożliwiającego pisanie botów do Starcrafta 2. Wcześniej ludzie z DeepMind stworzyli bota grającego w popularną w Azji grę planszową Go, w której człowiek przez długi czas był nie do pokonania przez komputer. Oczywiście, DeepMind nie tworzy tego środowiska do Starcrafta, bo uwielbiają tworzyć boty tylko dlatego, że badania nad botami pomogą rozwinąć algorytytmy uczenia maszynowego, a szczególnie reinforcement learningu, transfer learningu, unsupervised learningu, curriculum learningu i innych dziedzin uczenia maszynowego. Starcraft jest kolejnym krokiem, którego pokonanie przybliży albo i nawet umozliwi nam stworzenie AGI (Artificial General Intelligence), czyli sztucznej inteligencji, która będzie tak wszechstronna jak człowiek, w przeciwieństwie do ANI (Artificial Narrow Intelligence), która jest dobra tylko w jednej wąskiej dziedzinie.

Dołączam do tego wyścigu, ale prawdę mówiąc nie mam wielkich szans :) Gdzie mi, biednemu programiście, do potęgi obliczeniowej Google'a i ich zespołów badaczy? Z czym do ludu. Nawet karty graficznej z CUDA nie mam. Wychodzę jednak z założenia, że liczy się dobra zabawa i nauka. I tego zamierzam się trzymać.

## Czym jest Starcraft?

Starcraft 2 jest obecnie zdecydowanie najpopularniejszą e-sportową strategią czasu rzeczywistego. Możemy w niej grać trzema zróżnicowanymi rasami: Zergami, Protossami i Terranami. Zergowie to insektoidalna rasa, która potrafi się zmutować w zależności od potrzeb. Terranie to natomiast ludzie. Mają czołgi i inne takie wesołe rzeczy. Protossi to humanoidalna rasa połączona więzami telepatycznymi. Cali na złoto, teleportacja to ich drugie imię, ciągle gadają o umieraniu za Aiur.

Celem każdej rozgrywki jest zniszczenie wszystkich budynków przeciwnika. Nie trzeba niszczyć całej armii przeciwnika, wystarczy zrównać z ziemią każdy budynek. W grze może dojść także do remisu. Dokładnie nie pamiętam jak, ale przez chyba trzy minuty żadna ze stron nie może zbierać surowców, zniszczyć niczego ani wybudować. Rzadko się to zresztą zdarza (raz mi się udało).

Aby wygrać musimy zbierać surowce (są dwa: minerały i gaz), budować budynki, tworzyć armię i wynajdywać ulepszenia, czyli robić to co w zasadzie w każdym innym RTS-ie. Istnieje limit jednostek i wynosi on 200.

Gra jest bardzo wymagająca, wszystko toczy się szybko i trzeba naprawdę ogarniać, żeby przeżyć :) Aby być dobrym trzeba mieć dobre micro i macro. Micro jest to po prostu zarządzanie jednostkami, a szczególnie wojskiem w trakcie potyczek. Macro natomiast jest to natomiast ogarnianie ekonomii. Trzeba budować odpowiednio dużo workerów, mieć saturację baz (optymalnie 16 workerów na minerały i 3 workery na każdy gaz w każdej bazie), ogarniać cykliczne rzeczy specyficzne dla każdej rasy jak larva injecty, chrono boosty, dropy mułów. Z doświadczenia muszę napisać, że najważniejsze jest makro. Co ci po dobrym micro jak nie masz czym mikrować?

Przykład naprawdę trudnego micro:

<iframe src="https://www.youtube.com/embed/SUXUPLVfT-g" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

W typowej rozgrywce można się spotkać z następującymi rzeczami: możemy zagrać grę macro, all-ina, albo timing attack. Typowa gra macro jest zazwyczaj dość długa, gracze rozwijają się spokojnie nie robiąc ryzykownych rzeczy. Czasami takie gry kończą się base trade'ami, czyli sytuacją, gdy gracze zamiast walczyć armiami ze sobą nawzajem próbują zniszczyć wrogie bazy. All-iny to natomiast sytuacje, gdy poświęcamy rozwój ekonomiczny na początku rozgrywki, robimy armię i próbujemy jak najszybciej zmiażdżyć przeciwnika przewagą wojska. Jeśli all-in nie wejdzie to przeważnie przegrywamy grę, bo straty ekonomiczne są zbyt duże. Natomiast timing attack to jest sytuacja, gdy próbujemy wykorzystać pewne słabości buildu przeciwnika atakując w specyficznym momencie, w którym przeciwnik jest w jakiś sposób słabszy. Jeśli timing attack wejdzie to wygrywamy.

Długa gra macro:

<iframe src="https://www.youtube.com/embed/cRLcG5uGcP4" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

All-in:

<iframe src="https://www.youtube.com/embed/s81IA2y_TVc" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

Timingi:

<iframe width="560" height="600" src="https://www.youtube.com/embed/A8LWvf6Sxl0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

Basetrade:

<iframe src="https://www.youtube.com/embed/GQFOHEg78kM" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## Dlaczego ta gra jest tak trudna dla AI?

Przede wszystkim w Starcrafcie większość informacji jest niedostępnych dla gracza ze względu na występującą w grze mgłę wojny, czyli obszar, który jest niewidoczny dla gracza. Dobrze grający bot będzie musiał efektywnie korzystać z pamięci, planować w dłuższej perspektywie czasowej, modyfikować znacząco plany w reakcji na poczynania przeciwnika. W grze jest także możliwe naprawdę wiele akcji do wykonania, bot będzie musiał je także planować. Takie na przykład wybudowanie budynku to jest zaznaczenie jednostki budującej, kliknięcie gdzieś na mapie (zmiana kamery), wybranie budynku z listy akcji tej jednostki i kliknięcie na teren, by rozpocząć budowę.

Środowisko do botów będzie miało interfejs skryptowy taki jak poprzednia część Starcrafta (czyli coś jak BWAPI), a także generowany prosty interfejs graficzny, by boty mogły uczyć się na podstawie pikseli. Do tego jeszcze opublikowane mają zostać scenariusze do trenowania (do curriculum learning).

<iframe width="1075" height="600" src="https://www.youtube.com/embed/5iZlrBqDYPM" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

## Plany

Na pewno chciałbym wytrenować bota, który chociaż potrafi walczyć praktycznie każdą możliwą kompozycją jednostek dla danej rasy. Do tego chciałbym zrealizować scenariusz uproszczonej rozgrywki, w której bot może budować tylko podstawową jednostkę walczącą (Zerglinga, Zealota, Marine'a).

Na razie nie udostępniono środowiska (ponoć ma być w pierwszym kwartale 2017, czyli w tym miesiącu), więc na razie będę bawił się z replayami, co i tak potem będzie konieczne by trenować sieci neuronowe. Jeśli jednak skończą mi się pomysły co robić z replayami to prawdopodobnie spróbuję napisać uproszczoną wersję Starcrafta w JS na canvasie i zrobić jakieś proste scenariusze do tego.

Wszelki kod będzie na moim githubie w repozytorium [starcraft-ai](https://github.com/dloranc/starcraft-ai).
