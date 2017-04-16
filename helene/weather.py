# -*- coding: utf-8 -*-

from lxml import etree
from voidpp_tools.http import HTTP
from service import Service
import re

def parse_temp(temp):
    """This magnificent function iterates throught the string and if found a non int char, breaks

    Args:
        temp (str): temp string, must be started with numbers (eg 42°C)

    Returns:
        int: temp as int
    """
    number = ""
    for char in temp:
        try:
            int(char)
            number += char
        except:
            break
    return number if int(number) else None

BASE = '/html/body/div/div[3]/div[1]/div[2]'

class Weather(Service):
    name = 'weather'

    def __init__(self):
        self._base_url = "https://www.idokep.hu"
        self._url = self._base_url + "/idojaras/Budapest"

    def _parse_current(self, tree):

        item = tree.xpath(BASE + '/div[1]/div[1]')[0]
        image_item = item[1][0][0]

        return dict(
            icon = self._base_url + image_item.attrib['src'],
            svg = self._base_url + image_item.attrib['xlink:href'],
            temp = parse_temp(item[2].text),
        )

    def _parse_short_forecast(self, tree):
        # skip the first (now) and the second (almost now) item
        items = tree.xpath(BASE + '/div[1]')[0][2:]

        res = []

        for item in items:
            res.append(dict(
                time = item[0].text,
                temp = parse_temp(item[2].text),
                icon = self._base_url + item[1][0].attrib['src'],
                svg = self._base_url + item[1][0].attrib['src'],
            ))

        return res

    def _parse_long_forecast(self, tree):
        res = []

        items = tree.xpath(BASE + '/div[3]')[0][1:8]

        for item in items:
            day_element = item

            day_data = dict(
                day = dict(
                    num = int(day_element[0][0].text),
                    text = day_element[0][1].text,
                ),
                icon = self._base_url + day_element[1][0][0].attrib['xlink:href'],
                temp = dict(
                    max = int(day_element[2].text),
                    min = int(day_element[3].text),
                )
            )

            res.append(day_data)

        return res

    def fetch_content(self, tree):
        data = dict(
            current = self._parse_current(tree),
            forecast = self._parse_short_forecast(tree),
            forecast_long = self._parse_long_forecast(tree),
        )

        return data

    def __call__(self):
        content = HTTP.load_url(self._url)
        parser = etree.HTMLParser()
        tree = etree.parse(content, parser)

        return self.fetch_content(tree)
