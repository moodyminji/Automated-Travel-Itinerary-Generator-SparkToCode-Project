package com.AutomatedTravelApp.travel.ai;

import com.AutomatedTravelApp.travel.model.*;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

public class AIEngineTest {

    public static void main(String[] args) throws Exception {
        // Dummy user
        User user = new User();
        user.setPreferences("Adventure, Nature");

        // Dummy activity
        Activity activity = new Activity();
        activity.setName("Museum Visit");
        activity.setCostCurrency("USD");

        // Dummy itinerary day
        ItineraryDay day = new ItineraryDay();
        day.setDayNumber(1);
        day.setActivities(Collections.singletonList(activity));

        // Link activity back to its day (important because of @ManyToOne)
        activity.setItineraryDay(day);

        // Dummy trip
        Trip trip = new Trip();
        trip.setDestination("Paris");
        trip.setStartDate(LocalDate.of(2025, 8, 25));
        trip.setEndDate(LocalDate.of(2025, 8, 30));
        trip.setBudgetAmount(BigDecimal.valueOf(2000));
        trip.setBudgetCurrency("USD");
        trip.setUser(user);
        trip.setDays(Collections.singletonList(day));

        // Link day back to its trip
        day.setTrip(trip);

        // Dummy responseData
        GenerateItineraryResponse responseData = new GenerateItineraryResponse();
        responseData.setTravelStyle(TravelStyle.BUDGET);

        // Run AIEngine
        AIEngine engine = new AIEngine();
        String json = engine.generateItineraryJson(trip, responseData);

        // Print JSON
        System.out.println("Generated Itinerary JSON:");
        System.out.println(json);
    }
}
