package ru.hackathon;

import com.google.common.base.Charsets;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TimeTableParser {

	public static final CSVFormat CSV_FORMAT = CSVFormat.newFormat('\t').withFirstRecordAsHeader();
	public static final String STATION_NAME = "Остановочные пункты";
	private final List<String> trains = new ArrayList<>();

	private void load(String filename) throws IOException {
		try (CSVParser parser = CSVParser.parse(new File(filename), Charsets.UTF_8, CSV_FORMAT)) {
			Map<String, Integer> headers = parser.getHeaderMap();
			trains.addAll(headers.keySet());
			trains.remove(STATION_NAME);
			System.out.println("Train numbers: " + trains);
		}
	}

	private void save(String filename) {

	}

	public static void main(String[] args) throws IOException {
		TimeTableParser parser = new TimeTableParser();
		parser.load(args[0]);
		parser.save(args[1]);
	}
}
