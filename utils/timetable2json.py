#!/usr/bin/env python3

import json
import re

KnownStations = [
	"Белорусская",
	"Беговая",
	"Фили",
	"Кунцево-1",
	"Сетунь",
	"Баковка",
	"Одинцово",
	"Отрадное",
	"Жаворонки",
	"Голицыно",
]

def isKnownStation(station):
	for ks in KnownStations:
		if ks in station:
			return True
	return False

def main():
	trains = []
	with open("timetable.csv", encoding='utf8') as f:
		for tid in f.readline().split(','):
			m = re.match(r"^\d+", tid.strip())
			trainId = None
			if m:
				trainId = int(m.group(0))
			trains.append({"trainId": trainId, "stations": []})

		for index, ttype in enumerate(f.readline().split(',')):
			trains[index]["trainType"] = ttype.strip()

		for line in f.readlines():
			cells = line.split(',')
			station = cells[0]

			if not isKnownStation(station):
				continue

			cells = cells[1:]
			for index, train in enumerate(trains):
				if len(cells) <= index:
					print("Such much trains!")
					break

				t = None
				try:
					h, m = map(int, cells[index].strip().split('.'))
					t = h*60 + m
				except:
					pass

				if t:
					train["stations"].append({"station": station, "time": h*60 + m})

	with open("timetable.js", "w", encoding='utf8') as f:
		print("var timetable = ", file=f, end="")
		json.dump(trains, f)

if __name__ == "__main__":
	main()
