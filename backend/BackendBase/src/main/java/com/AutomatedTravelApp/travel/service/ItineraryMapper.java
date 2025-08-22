package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.Activity;
import com.AutomatedTravelApp.travel.model.ItineraryDay;
import com.AutomatedTravelApp.travel.model.Trip;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class ItineraryMapper {

    public GenerateItineraryResponse fromTrip(Trip trip,
                                              List<ItineraryDay> days,
                                              List<Activity> activities) {
        var resp = new GenerateItineraryResponse();
        resp.setItineraryId(trip.getId());
        resp.setMessage("Itinerary loaded");
        resp.setDestination(trip.getDestination());
        resp.setStartDate(trip.getStartDate());
        resp.setEndDate(trip.getEndDate());
        resp.setTotalBudget(trip.getBudgetAmount() == null ? 0.0 : trip.getBudgetAmount().doubleValue());
        resp.setTravelStyle(trip.getTravelStyle());
        resp.setBudgetBreakdown(trip.getBudgetBreakdown() == null ? Map.of() : new LinkedHashMap<>(trip.getBudgetBreakdown()));
        resp.setInterests(trip.getInterests());
        resp.setPeopleCount(trip.getPeopleCount());

        var dayDtos = new ArrayList<GenerateItineraryResponse.ItineraryDayDto>();
        for (var d : days) {
            dayDtos.add(new GenerateItineraryResponse.ItineraryDayDto(d.getDayNumber(), false, null));
        }
        resp.setItineraryDays(dayDtos);

        var actDtos = new ArrayList<GenerateItineraryResponse.ActivityDto>();
        for (var a : activities) {
            actDtos.add(new GenerateItineraryResponse.ActivityDto(
                    a.getName(), null, a.getLocation(),
                    a.getCostAmount() == null ? null : a.getCostAmount().doubleValue(),
                    null,
                    a.getDurationMinutes(),
                    a.getItineraryDay() != null ? a.getItineraryDay().getDayNumber() : null
            ));
        }
        resp.setActivities(actDtos);

        return resp;
    }
}
