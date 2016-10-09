#!/usr/bin/env python3

import json
import sys

filenames = {
	# 'Беговая': 'data_БЕГОВАЯ_среда_раб.json',
	# 'Баковка': "data_БАКОВКА_среда_раб.json",
	# "Голицыно": "data_ГОЛИЦЫНО_среда_раб.json"
	"Белорусская": "data_МОСКВА БЕЛОРУССКАЯ_среда_раб.json",
	"Беговая": "data_БЕГОВАЯ_среда_раб.json",
	"Фили": "data_ФИЛИ_среда_раб.json",
	"Кунцево-1": "data_КУНЦЕВО 1_среда_раб.json",
	"Сетунь": "data_СЕТУНЬ_среда_раб.json",
	"Баковка": "data_БАКОВКА_среда_раб.json",
	"Одинцово": "data_ОДИНЦОВО_среда_раб.json",
	"Отрадное": "data_ОТРАДНОЕ СМОЛ._среда_раб.json",
	"Жаворонки": "data_ЖАВОРОНКИ_среда_раб.json",
	"Голицыно": "data_ГОЛИЦЫНО_среда_раб.json",
}

def __main__():
	raw_data = {}
	for k, v in filenames.items():
		with open("stations_in_out/{}".format(v), 'r') as f:
			raw_data[k] = json.load(f)

	result = [] # [time -> {stationName -> {in: 12, out: 32}}]
	for t in range(60*24):
		sres = {}
		for k, f in raw_data.items():
			for datum in raw_data[k]:
				if datum["time"] == t:
					sres[k] = {"in": datum["in"], "out": datum["out"]}
					break
			else:
				sres[k] = {"in": 0, "out": 0}
		result.append(sres)

	with open("wednesday.js", 'w') as f:
		print("var data_inout = ", file=f, end="")
		json.dump(result, f)

if __name__ == "__main__":
	__main__()
