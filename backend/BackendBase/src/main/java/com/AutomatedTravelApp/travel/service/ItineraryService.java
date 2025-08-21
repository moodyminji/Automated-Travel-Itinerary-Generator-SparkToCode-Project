package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.*;
import com.AutomatedTravelApp.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

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
    var user = userRepository.findByEmail("demo@user.com").orElseGet(() -> {
        var u = new User();
        u.setEmail("demo@user.com");
        u.setPasswordHash("hashed");
        return userRepository.save(u);
    });

    LocalDate start = Optional.ofNullable(req.getStartDate()).orElse(LocalDate.now());
    LocalDate end   = Optional.ofNullable(req.getEndDate()).orElse(start.plusDays(Math.max(1, req.getDays())));

    String style = Optional.ofNullable(req.getTravelStyle())
            .map(String::toLowerCase)
            .filter(s -> Set.of("luxury","comfort","budget").contains(s))
            .orElse("comfort");

    Map<String, Double> breakdown = (req.getBudgetBreakdown() != null && !req.getBudgetBreakdown().isEmpty())
            ? new LinkedHashMap<>(req.getBudgetBreakdown())
            : defaultBreakdownFor(style, 1000.0); // default total (OMR)

    BigDecimal total = BigDecimal.valueOf(breakdown.values().stream().mapToDouble(Double::doubleValue).sum());

    Trip trip = Trip.builder()
            .user(user)
            .destination(req.getDestination())
            .startDate(start)
            .endDate(end)
            .budgetAmount(total)
            .travelStyle(style)
            .budgetBreakdown(breakdown)
            .build();
    trip = tripRepository.save(trip);

    // Seed day/activity as before
    ItineraryDay day1 = ItineraryDay.builder()
            .trip(trip)
            .dayNumber(1)
            .build();
    day1 = dayRepository.save(day1);

    Activity a = Activity.builder()
            .itineraryDay(day1)
            .position(1)
            .name("Explore " + req.getDestination())
            .location(req.getDestination())
            .costAmount(BigDecimal.ZERO)
            .costCurrency("OMR")
            .durationMinutes(90)
            .build();
    activityRepository.save(a);

    var days = dayRepository.findByTripId(trip.getId());
    var acts = activityRepository.findByItineraryDayTripId(trip.getId());
    var res = mapper.fromTrip(trip, days, acts);
    res.setMessage("Itinerary created");
    return res;
}

    @Transactional
    public GenerateItineraryResponse updateItinerary(Long id, GenerateItineraryRequest req) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + id));

        if (req.getDestination() != null && !req.getDestination().isBlank()) trip.setDestination(req.getDestination());
        if (req.getStartDate() != null) trip.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) trip.setEndDate(req.getEndDate());

        if (req.getTravelStyle() != null && !req.getTravelStyle().isBlank()) {
            String style = req.getTravelStyle().toLowerCase();
            if (Set.of("luxury","comfort","budget").contains(style)) {
                trip.setTravelStyle(style);
                // if no breakdown provided with style change, regenerate using current total
                if (req.getBudgetBreakdown() == null || req.getBudgetBreakdown().isEmpty()) {
                    double total = trip.getBudgetAmount() == null ? 1000.0 : trip.getBudgetAmount().doubleValue();
                    trip.setBudgetBreakdown(defaultBreakdownFor(style, total));
                }
            }
        }
        if (req.getBudgetBreakdown() != null && !req.getBudgetBreakdown().isEmpty()) {
            trip.setBudgetBreakdown(new LinkedHashMap<>(req.getBudgetBreakdown()));
            double total = trip.getBudgetBreakdown().values().stream().mapToDouble(Double::doubleValue).sum();
            trip.setBudgetAmount(BigDecimal.valueOf(total));
        }

        trip = tripRepository.save(trip);

        var days = dayRepository.findByTripId(id);
        var acts = activityRepository.findByItineraryDayTripId(id);
        var res = mapper.fromTrip(trip, days, acts);
        res.setMessage("Itinerary updated");
        return res;
    }

    private Map<String, Double> defaultBreakdownFor(String style, double total) {
        Map<String, Double> ratios = switch (style) {
            case "luxury" -> Map.of("accommodation",0.50,"flights",0.20,"activities",0.20,"food",0.08,"misc",0.02);
            case "budget" -> Map.of("accommodation",0.30,"flights",0.25,"activities",0.25,"food",0.15,"misc",0.05);
            default       -> Map.of("accommodation",0.40,"flights",0.22,"activities",0.23,"food",0.12,"misc",0.03);
        };
        Map<String, Double> out = new LinkedHashMap<>();
        ratios.forEach((k,v) -> out.put(k, Math.round(total * v * 100.0) / 100.0));
        return out;
    }

    @Transactional(readOnly = true)
    public GenerateItineraryResponse getById(Long itineraryId) {
        Trip trip = tripRepository.findById(itineraryId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + itineraryId));

        // Days for this trip, in order
        List<ItineraryDay> days = dayRepository.findByTripOrderByDayNumberAsc(trip);

        // All activities for those days (flatten)
        List<Activity> activities = new ArrayList<>();
        for (ItineraryDay d : days) {
            activities.addAll(activityRepository.findByItineraryDayOrderByPosition(d));
        }

        return mapper.fromTrip(trip, days, activities);
    }
}
