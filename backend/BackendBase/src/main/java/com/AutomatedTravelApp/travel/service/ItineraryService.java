package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.*;
import com.AutomatedTravelApp.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItineraryService {
    
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ItineraryDayRepository dayRepository;
    private final ActivityRepository activityRepository;
    private final ItineraryMapper mapper;

    @Transactional
    public GenerateItineraryResponse generate(GenerateItineraryRequest req) {
        // 1) demo user (find-or-create)
        User user = userRepository.findByEmail("demo@user.com").orElseGet(() -> {
            User u = new User();
            u.setEmail("demo@user.com");
            u.setPasswordHash("hashed");
            return userRepository.save(u);
        });

        LocalDate start = req.getStartDate() != null ? req.getStartDate() : LocalDate.now();
        LocalDate end = req.getEndDate() != null ? req.getEndDate() : start.plusDays(Math.max(1, req.getDays()));


        Trip trip = Trip.builder()
                .user(user)
                .destination(req.getDestination())
                .startDate(start)
                .endDate(end)
                .budgetAmount(req.getBudget() != null
                        ? BigDecimal.valueOf(req.getBudget()) : BigDecimal.ZERO)
                .budgetCurrency("OMR")
                .build();
        trip = tripRepository.save(trip);

        ItineraryDay day1 = ItineraryDay.builder()
                .trip(trip)
                .dayNumber(1)
                .build();
        day1 = dayRepository.save(day1);

        String interests = (req.getInterests() != null && !req.getInterests().isEmpty())
                ? String.join(", ", req.getInterests())
                : "local highlights";

        Activity a = Activity.builder()
                .itineraryDay(day1)
                .position(1)
                .name("Welcome walk + " + interests)
                .location(req.getDestination())
                .costAmount(BigDecimal.ZERO)
                .costCurrency("OMR")
                .durationMinutes(90)
                .build();
        activityRepository.save(a);

        var days = new ArrayList<ItineraryDay>();
        days.add(day1);
        var acts = new ArrayList<Activity>();
        acts.add(a);
        return mapper.fromTrip(trip, days, acts);
    }

    @Transactional(readOnly = true)
    public GenerateItineraryResponse getById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + tripId));

        var days = dayRepository.findByTripOrderByDayNumberAsc(trip);

        var activities = new ArrayList<Activity>();
        for (var d : days) {
            activities.addAll(activityRepository.findByItineraryDayOrderByPosition(d));
        }

        return mapper.fromTrip(trip, days, activities);
    }


    private BigDecimal toBigDecimal(Number n) {
        if (n == null) return BigDecimal.ZERO;
        return new BigDecimal(String.valueOf(n));
    }

}
