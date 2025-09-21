---
title: Moja przygoda z Rocq - garść porad jak zacząć
tags:
  - rocq
description: Wgłębiłem się w fascynujący świat narzędzi do dowodzenia twierdzeń matematycznych i napisałem jak zacząć z Rocq.
---

# Rocq

Ostatnio, wiedziony ciekawością po przeczytaniu [artykułu na Quanta Magazine](https://www.quantamagazine.org/amateur-mathematicians-find-fifth-busy-beaver-turing-machine-20240702/) o udowodnieniu wartości funkcji Busy Beavera dla pięciostanowych dwuznakowych maszyn Turinga, zacząłem się bawić Rocqem. Jest to tak zwany proof assistant i służy matematykom do dowodzenia twierdzeń matematycznych, a programistom może posłużyć do formalnego dowodzenia poprawności ich kodu. Miałem na początku dość sporo problemów, by w ogóle zacząć zabawę. Pierwszy tutorial jakiego spróbowałem był dla mnie zbyt trudny i niejasny, a samo używanie Rocqa dalekie od optymalnego. Po spędzeniu paru godzin doszedłem w końcu jak używać efektywnie samego języka i z czego się uczyć.

## Setup

Nie będę pisał jak zainstalować to narzędzie, bo to każdy powinien umieć zrobić w swoim zakresie. Ja zainstalowałem przez opam, czyli taki package manager dla OCamla. Na początku próbowałem pisać dowody i kompilować je z linii komend, ale to błąd, bo ze względu brak danych o kontekście w jakim jest Rocq, gdy coś jest nie tak, to debugowanie tego jest bardzo utrudnione. Moim zdaniem najlepiej pracować za pomocą wtyczki do Visual Studio Code o nazwie VsCoq. Super rozwiązanie, moja praca z kodem polega na tym, że piszę coś i uruchamiam wykonywanie właśnie napisanej linijki. Bardzo wygodne, bo z prawej strony edytora mam podgląd na to co się dzieje z dowodem, a za pomocą dwóch skrótów klawiszowych mogę przechodzić o instrukcję w przód albo w tył.
