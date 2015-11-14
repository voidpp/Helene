
from lxml import etree

import tools
from service import Service

def parse_temp(temp):
    try:
        return int(temp.split(' ')[0])
    except:
        return None

class Weather(Service):
    name = 'weather'

    def __init__(self):
        self.__url = 'http://m.idokep.hu/'

    def fetch_content(self, tree):
        data = dict(
            current = {},
            forecast = [],
            forecast_long = [],
        )

        current_attribs = tree.xpath('/html/body/div/div[3]/table/tr/td[2]/svg/image')[0].attrib

        data['current'] = dict(
            icon = current_attribs['src'],
            svg = current_attribs['xlink:href'],
            temp = parse_temp(tree.xpath('/html/body/div/div[3]/table/tr/td[2]/strong')[0].text),
        )

        for item in tree.xpath('/html/body/div/div[4]/table/tr/td'):
            data['forecast'].append(dict(
                time = item[0].text,
                temp = parse_temp(item[2].text),
                icon = item[1][0][0].attrib['src'],
                svg = item[1][0][0].attrib['xlink:href'],
            ))

        limits = dict(
            min = 100,
            max = -100,
        )

        for item in tree.xpath('/html/body/div/div[5]/div'):
            day_element = item[0]

            day_data = dict(
                day = dict(
                    num = int(day_element[0].text),
                    text = day_element[2].text,
                ),
                icon = day_element[4].attrib['src'],
                temp = dict(
                    max = int(item[1].text),
                    min = None,
                )
            )

            if day_data['temp']['max'] > limits['max']:
                limits['max'] = day_data['temp']['max']

            if len(item) == 3:
                day_data['temp']['min'] = int(item[2].text)

                if day_data['temp']['min'] < limits['min']:
                    limits['min'] = day_data['temp']['min']

            data['forecast_long'].append(day_data)


        data['forecast_limits'] = limits

        return data

    def __call__(self):
        content = tools.load_url(self.__url)
        parser = etree.HTMLParser()
        tree = etree.parse(content, parser)

        return self.fetch_content(tree)
