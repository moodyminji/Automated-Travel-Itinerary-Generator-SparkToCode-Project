package com.AutomatedTravelApp.travel.ai;

import com.AutomatedTravelApp.travel.model.Trip;
import com.AutomatedTravelApp.travel.model.Activity;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.format.DateTimeFormatter;

public class AIEngine {

    private final Client client;
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public String finalJson; // stores the last generated JSON

    public AIEngine() {
        this.client = new Client();
    }

    public String generateItineraryJson(Trip trip, GenerateItineraryResponse responseData) throws Exception {

        String destination = trip.getDestination();
        String startDate = trip.getStartDate().format(DATE_FORMAT);
        String endDate = trip.getEndDate().format(DATE_FORMAT);
        double budget = trip.getBudgetAmount().doubleValue();
        String preferences = trip.getUser().getPreferences();

        String currency = trip.getDays().stream()
                .flatMap(day -> day.getActivities().stream())
                .findFirst()
                .map(Activity::getCostCurrency)
                .orElse(trip.getBudgetCurrency());

        String itineraryId = responseData.getItineraryId() != null ?
                responseData.getItineraryId().toString() :
                "ITIN-" + System.currentTimeMillis();

        String travelStyle = responseData.getTravelStyle() != null ? responseData.getTravelStyle() : "Balanced";

        String pacingRules;
        switch (travelStyle.toLowerCase()) {
            case "luxury":
                pacingRules = "Max 2 activities/day, rest every 2-3 days, total activity duration 4-5 hrs, more budget on hotel & food";
                break;
            case "budget":
                pacingRules = "Max 3 activities/day, rest every 4-5 days, total activity duration 6-7 hrs, balanced budget";
                break;
            case "adventure":
                pacingRules = "4+ activities/day, rest optional, total activity duration 8-10 hrs, more budget on activities";
                break;
            case "family":
                pacingRules = "2-3 activities/day, rest every 3 days, total activity duration 5-6 hrs, balanced budget with focus on comfort & convenience";
                break;
            default:
                pacingRules = "Balanced pacing rules";
        }

        String prompt = """
                You are a travel planning AI. Generate a complete travel itinerary for a user based on the following information:

                Requirements:
                1. Output MUST be strictly in the following JSON format:
                {
                  "itineraryId": "%s",
                  "days": [
                    {
                      "date": "DD-MM-YYYY",
                      "activities": [
                        {
                          "id": "A1",
                          "name": "Activity Name",
                          "start": "HH:MM",
                          "end": "HH:MM",
                          "cost": [COST_IN_LOCAL_CURRENCY]
                        }
                      ],
                      "dayCost": [SUM_OF_ACTIVITY_COSTS]
                    }
                  ],
                  "totalCost": [SUM_OF_FLIGHT_HOTEL_AND_DAY_COSTS],
                  "flight": {
                    "id": "F1",
                    "departure": "DD-MM-YYYY HH:MM",
                    "arrival": "DD-MM-YYYY HH:MM",
                    "cost": [FLIGHT_COST]
                  },
                  "hotel": {
                    "id": "H1",
                    "name": "Hotel Name",
                    "checkIn": "DD-MM-YYYY",
                    "checkOut": "DD-MM-YYYY",
                    "cost": [HOTEL_COST]
                  }
                }

                2. All monetary amounts must be in %s.
                3. Generate realistic activity names, start and end times, and approximate costs.
                4. Include flight and hotel costs. Total cost must equal flight + hotel + all day activities.
                5. JSON must be valid and parsable. Do not include text outside JSON.

                Inputs:
                Origin: Origin
                Destination: %s
                Start Date: %s
                End Date: %s
                Budget: %.2f
                Preferences: %s
                Travel Style: %s
                Pacing Rules: %s
                """.formatted(itineraryId, currency, destination, startDate, endDate, budget, preferences, travelStyle, pacingRules);

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
        );

        String rawText = response.text();
        finalJson = cleanJson(rawText); // store in class-level variable

        objectMapper.readTree(finalJson);

        return finalJson;
    }

    private static String cleanJson(String raw) {
        if (raw == null) return "{}";
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("(?s)```(json)?", "").trim();
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
        }
        return cleaned;
    }
}
