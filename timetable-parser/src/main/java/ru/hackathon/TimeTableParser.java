package ru.hackathon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.HashBiMap;
import com.google.common.primitives.Ints;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class TimeTableParser {

	public static final CSVFormat CSV_FORMAT = CSVFormat.newFormat('\t').withFirstRecordAsHeader();
	public static final String STATION_NAME = "Остановочные пункты";
	private final List<String> trains = new ArrayList<>();
	private final Map<String, Timetable> timetables = new HashMap<>();
	private final ObjectMapper mapper = new ObjectMapper();

	private void load(String filename) throws IOException {
		try (CSVParser parser = CSVParser.parse(new File(filename), Charsets.UTF_8, CSV_FORMAT)) {
			Map<String, Integer> headers = parser.getHeaderMap();
			trains.addAll(headers.keySet());
			trains.remove(STATION_NAME);
			Preconditions.checkState(!trains.contains(null) && !trains.contains(""));
			System.out.println("Train numbers: " + trains);
			for (CSVRecord record : parser.getRecords()) {
				String station = record.get(STATION_NAME);
				System.out.println(station);
				for (String train : trains) {
					String timeStr = record.get(train);
					System.out.println(train);
					System.out.println(timeStr);
					if ("".equals(timeStr)) {
						// train does not go there (too far)
						continue;
					} else if ("-".equals(timeStr)) {
						// train passes station without stop
						continue;
					}
					Iterator<String> timeStrParts = Splitter.on('.').split(timeStr).iterator();
					int timeOfDeparture = Ints.tryParse(timeStrParts.next()) * 60 + Ints.tryParse(timeStrParts.next());
					Timetable timetable = timetables.getOrDefault(train, new Timetable());
					Preconditions.checkState(!timetable.getStationTimeMap().containsKey(station));
					timetable.getStationTimeMap().put(station, timeOfDeparture);
					timetables.put(train, timetable);
				}
			}
		}
	}

	private void saveTimetable(String filename) throws IOException {
		Files.write(Paths.get(filename),
				Arrays.asList(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(timetables)));
	}

	public static void main(String[] args) throws IOException {
		TimeTableParser parser = new TimeTableParser();
		parser.load(args[0]);
		parser.saveTimetable(args[1]);
	}

	private static final class Timetable {
		private Map<String, Integer> stationTimeMap = HashBiMap.create();

		public Map<String, Integer> getStationTimeMap() {
			return stationTimeMap;
		}
	}
}
