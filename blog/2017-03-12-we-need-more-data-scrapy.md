---
title: We need more data - Scrapy

tags:
    - Projekty
    - DSP2017
    - scrapy
    - starcraft
image: scrapy.jpg
description: Do projektu z machine learningu potrzeba dużo danych, które trzeba jakoś zdobyć. Dzisiaj o wykorzystaniu biblioteki Scrapy do tego celu.
---
*Ten post jest o rozwijanym przeze mnie bocie do Starcrafta wykorzystującym uczenie maszynowe. Projekt jest rozwijany w ramach konkursu "Daj Się Poznać 2017".*

---

Każdy ambitny gracz Starcrafta 2 wie, że nie wystarczy grać, aby być dobrym. Trzeba, między innymi, analizować swoje gry, a także gry innych, lepszych od nas graczy. Byłoby fajnie gdyby mój bot też coś takiego potrafił przynajmniej w ograniczonym zakresie. Potrzebne mi będą zatem replaye. Skąd je wziąć? Najczęściej bierze się je z takich serwisów jak `spawningtool.com` albo `ggtracker.com`, gdzie są publikowane przez graczy. Organizatorzy dużych turniejów także udostępniają paczki z grami profesjonalnych graczy, ale przeszukiwanie internetu, by zdobyć te paczki mnie nie interesuje.

<!-- truncate -->

Postanowiłem zatem napisać prosty scrapper przechodzący przez podstrony, wyciągający linki z tabel i pobierający gry z [spawningtool.com](http://lotv.spawningtool.com/replays/).

## Kod

Najpierw, oczywiście, zainstalowałem `Scrapy` (później się okazało, że będzie potrzebna także biblioteka `requests`):

```sh
pip install scrapy
```

Aby zacząć korzystać ze `Scrapy` można napisać od razu jakiś prosty skrypt i odpalić go używając komendy `scrapy runspider <skrypt>` albo utworzyć projekt. Ja wybrałem tę drugą opcję i w katalogu głównym projektu wykonałem poniższą komendę:

```sh
scrapy startproject replays
```

Następnie w pliku `settings.py` ustawiłem `pipeline`, które umożliwia ściąganie plików, a także ustawiłem ścieżkę do której mają się ściągać pliki:

```python
ITEM_PIPELINES = {
   'scrapy.contrib.pipeline.images.FilesPipeline': 1,
}

FILES_STORE = "./files"
```

Następnie w pliku `items.py` stworzyłem prosty model tylko i wyłącznie z polami, które są wymagane, aby `Scrapy` pobierał pliki:

```python
# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class ReplaysItem(scrapy.Item):
    file_urls = scrapy.Field()
	files = scrapy.Field()
```

W katalogu `spiders` utworzyłem plik `spawning-tool-spider.py` o następującej treści:

```python
import scrapy
import requests
from replays.items import ReplayItem


class SpawningToolSpider(scrapy.Spider):
    name = 'spawning-tool-spider'
    # pierwsza strona z replayami, scrapy od czegoś musi zacząć
    start_urls = [
        'http://lotv.spawningtool.com/replays/?p=&query=&after_time=&'
        'before_time=&after_played_on=&before_played_on=&patch=&order_by='
    ]

    # scrapy uruchomiony w konsoli odpala tę metodę i zaczyna scrapować
    def parse(self, response):
        for row in response.css('table tr'):
            # pomijamy pierwszy wiersz tabeli
            if row.css('td:last-child ::attr(href)').extract_first() is None:
                continue
            else:
                url = 'http://lotv.spawningtool.com' \
                    + row.css('td:last-child ::attr(href)').extract_first()

                # typowa ścieżka z plikiem do downloadu to http://lotv.spawningtool.com/<liczba>/download/
                # ale przy pobieraniu następuje przekierowanie 302 do Amazona,
                # więc trzeba było coś z tym zrobić, bo scrapy odmówił posłuszeństwa
                # rozwiązaniem okazało się wyciągnięcie z nagłówków pola Location, czyli właściwego adresu
                request_response = requests.head(url)

                if request_response.status_code == 302:
                    url = request_response.headers["Location"]

                # split, bo scrapy próbował zapisać plik z wartościami pól GET
                # (coś w stylu 322d3a25z2z.SC2Replay?key=0JIDaAJ)
                url = url.split('?')

                # ok, mamy ścieżkę do pliku
                yield ReplayItem(file_urls=[url[0]])

        # przechodzimy do następnej strony
        next_page = response.css('a.pull-right ::attr(href)').extract_first()
        if next_page:
            yield scrapy.Request(response.urljoin(next_page), callback=self.parse)
```


Następnie wystarczyło odpalić w konsoli komendę:

```sh
scrapy crawl spawning-tool-spider
```

## Co dalej?

Na razie jednak dam sobie spokój z próbami przewidzenia co będzie zawierało środowisko od Blizzarda i DeepMind. Replayów nawet nie pobierałem, bo nie wiem czy jest sens. Myślę, że w tym tygodniu spróbuję odtworzyć scenariusze prostego micro z Starcrafta na przeglądarki internetowe i pod to będę pisał przykłady z użyciem sieci neuronowych i reinforcement learningu.
