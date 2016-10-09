package ru.hackathon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.Sets;
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
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class TimeTableParser {

	public static final CSVFormat CSV_FORMAT = CSVFormat.newFormat('\t').withFirstRecordAsHeader();
	public static final String STATION_NAME = "Остановочные пункты";
	private final Map<String, Timetable> timetables = new TreeMap<>();
	private final ObjectMapper mapper = new ObjectMapper();

	private List<String> load(String filename, String direction) throws IOException {
		final List<String> trains = new ArrayList<>();
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
					timetable.setDirection(direction);
					timetable.getStations().add(new Pair(station, timeOfDeparture));
					timetables.put(train, timetable);
				}
			}
		}
		return trains;
	}

	private void saveTimetable(String filename) throws IOException {
		Files.write(Paths.get(filename),
				Arrays.asList(
						"var timetable = " + mapper.writerWithDefaultPrettyPrinter().writeValueAsString(timetables)));
	}

	public static void main(String[] args) throws IOException {
		TimeTableParser parser = new TimeTableParser();
		List<String> from = parser.load(args[0], "from_moscow");
		List<String> to = parser.load(args[1], "to_moscow");
		Preconditions.checkState(Sets.intersection(new HashSet<>(from), new HashSet<>(to)).isEmpty());
		parser.saveTimetable(args[2]);
	}

	private static final class Timetable {
		private String direction;
		private List<Pair> stations = new ArrayList<>();

		public List<Pair> getStations() {
			return stations;
		}

		public void setDirection(String direction) {
			this.direction = direction;
		}

		public String getDirection() {

			return direction;
		}
	}

	private static final class Pair {
		private final String station;
		private final int time;

		public Pair(String station, int time) {
			this.station = station;
			this.time = time;
		}

		public String getStation() {
			return station;
		}

		public int getTime() {
			return time;
		}
	}
}
