---
title: We need more data - Scrapy

tags:
    - projects
    - dsp2017
    - scrapy
    - starcraft
image: images/posts_thumbnails/scrapy.jpg

description: A machine learning project requires a lot of data, which must be obtained somehow. Today I'm going to talk about using the Scrapy library for this purpose.
---
*This post is about the Starcraft bot I am developing using machine learning. The project is being developed as part of the "Daj Się Poznać 2017" competition.*

---

Every aspiring Starcraft 2 player knows that it is not enough to play to be good. You need, among other things, to analyze your games, as well as the games of other players who are better than you. It would be nice if my bot could do something like that too, at least to a limited extent. I will therefore need replays. Where to get them from? The most common way is to take them from sites like `spawningtool.com` or `ggtracker.com`, where they are published by players. Organizers of large tournaments also provide game packs from professional players, but searching the Internet to get these packs does not interest me.

<!-- truncate -->

So I decided to write a simple scrapper that goes through subpages, pulls links from tables and downloads games from [spawningtool.com](http://lotv.spawningtool.com/replays/).

## The code

First, of course, I installed `Scrapy` (it later turned out that you would also need the `requests` library):

```sh
pip install scrapy
```

To start using `Scrapy` you can either write some simple script right away and fire it using the `scrapy runspider <script>` command, or create a project. I chose the latter option and ran the following command in the root directory of the project:

```sh
scrapy startproject replays
```

Next, in the `settings.py` file, I set the `pipeline`, which allows files to be downloaded, and also set the path to which files should be downloaded:

```python
ITEM_PIPELINES = {
   'scrapy.contrib.pipeline.images.FilesPipeline': 1,
}

FILES_STORE = "./files"
```

Then, in the `items.py` file, I created a simple model with only the fields that are required for `Scrapy` to download files:

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

In the `spiders` directory, I created a `spawning-tool-spider.py` file with the following content:

```python
import scrapy
import requests
from replays.items import ReplayItem


class SpawningToolSpider(scrapy.Spider):
    name = 'spawning-tool-spider'
    # first page with replays, scrapy has to start somewhere
    start_urls = [
        'http://lotv.spawningtool.com/replays/?p=&query=&after_time=&'
        'before_time=&after_played_on=&before_played_on=&patch=&order_by='
    ]

    # scrapy running in the console fires this method and starts scraping
    def parse(self, response):
        for row in response.css('table tr'):
            # skip the first row of the table
            if row.css('td:last-child ::attr(href)').extract_first() is None:
                continue
            else:
                url = 'http://lotv.spawningtool.com' \
                    + row.css('td:last-child ::attr(href)').extract_first()

                # a typical path with a download file is http://lotv.spawningtool.com/<number>/download/
                # but when downloading there is a 302 redirect to Amazon,
                # so something had to be done about it, because the scrapy refused to work
                # The solution turned out to be pulling out the Location field from the headers,
                # which is the correct address
                request_response = requests.head(url)

                if request_response.status_code == 302:
                    url = request_response.headers["Location"]

                # split, because scrapy tried to save a file with GET field values
                # (something like 322d3a25z2z.SC2Replay?key=0JIDaAJ)
                url = url.split('?')

                # ok, we have the path to the file
                yield ReplayItem(file_urls=[url[0]])

        # go to the next page
        next_page = response.css('a.pull-right ::attr(href)').extract_first()
        if next_page:
            yield scrapy.Request(response.urljoin(next_page), callback=self.parse)
```


Then all you had to do was fire up the command in the console:

```sh
scrapy crawl spawning-tool-spider
```

## Co dalej?

For now, however, I'll give myself a break from trying to predict what the environment from Blizzard and DeepMind will contain. I haven't even downloaded the replays because I don't know if there's any point. I think this week I'll try to recreate the scenarios of a simple micro from Starcraft for web browsers and under that I'll write examples using neural networks and reinforcement learning.
