package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.*;
import com.AutomatedTravelApp.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

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
        LocalDate end = Optional.ofNullable(req.getEndDate())
                .orElse(start.plusDays(Math.max(1, Optional.ofNullable(req.getDays()).orElse(1))));

        TravelStyle style = Optional.ofNullable(req.getTravelStyle())
                .orElse(TravelStyle.COMFORT);

        double seedTotal = Optional.ofNullable(req.getBudget()).map(Number::doubleValue).orElse(1000.0);

        Map<String, Double> breakdown = (req.getBudgetBreakdown() != null && !req.getBudgetBreakdown().isEmpty())
                ? new LinkedHashMap<>(req.getBudgetBreakdown())
                : defaultBreakdownFor(style, seedTotal);

        BigDecimal totalAmount = BigDecimal.valueOf(
                breakdown.values().stream().mapToDouble(Double::doubleValue).sum()
        );

        Trip trip = Trip.builder()
                .user(user)
                .destination(req.getDestination())
                .startDate(start)
                .endDate(end)
                .budgetAmount(totalAmount)
                .travelStyle(style)
                .budgetBreakdown(breakdown)
                .interests(Optional.ofNullable(req.getInterests()).orElse(Set.of()))
                .peopleCount(Optional.ofNullable(req.getPeopleCount()).orElse(1))
                .build();
        trip = tripRepository.save(trip);

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

        var days = dayRepository.findByTripOrderByDayNumberAsc(trip);
        var acts = new ArrayList<Activity>();
        for (var d : days) {
            acts.addAll(activityRepository.findByItineraryDayOrderByPosition(d));
        }

        var res = mapper.fromTrip(trip, days, acts);
        res.setMessage("Itinerary created");
        return res;
    }

    @Transactional
    public GenerateItineraryResponse updateItinerary(Long id, GenerateItineraryRequest req) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + id));

        if (req.getDestination() != null && !req.getDestination().isBlank()) {
            trip.setDestination(req.getDestination());
        }
        if (req.getStartDate() != null) {
            trip.setStartDate(req.getStartDate());
        }
        if (req.getEndDate() != null) {
            trip.setEndDate(req.getEndDate());
        }

        if (req.getTravelStyle() != null) {
            trip.setTravelStyle(req.getTravelStyle());

            boolean noBreakdownProvided = (req.getBudgetBreakdown() == null || req.getBudgetBreakdown().isEmpty());
            if (noBreakdownProvided) {
                double total = (trip.getBudgetAmount() != null)
                        ? trip.getBudgetAmount().doubleValue()
                        : Optional.ofNullable(req.getBudget()).map(Number::doubleValue).orElse(1000.0);

                trip.setBudgetBreakdown(defaultBreakdownFor(req.getTravelStyle(), total));
                trip.setBudgetAmount(BigDecimal.valueOf(total));
            }
        }

        if (req.getBudget() != null && (req.getBudgetBreakdown() == null || req.getBudgetBreakdown().isEmpty())) {
            double total = req.getBudget().doubleValue();
            trip.setBudgetBreakdown(defaultBreakdownFor(trip.getTravelStyle(), total));
            trip.setBudgetAmount(BigDecimal.valueOf(total));
        }

        if (req.getBudgetBreakdown() != null && !req.getBudgetBreakdown().isEmpty()) {
            trip.setBudgetBreakdown(new LinkedHashMap<>(req.getBudgetBreakdown()));
            double total = trip.getBudgetBreakdown().values().stream().mapToDouble(Double::doubleValue).sum();
            trip.setBudgetAmount(BigDecimal.valueOf(total));
        }

        if (req.getInterests() != null) {
            trip.setInterests(req.getInterests());
        }
        if (req.getPeopleCount() != null && req.getPeopleCount() >= 1) {
            trip.setPeopleCount(req.getPeopleCount());
        }

        trip = tripRepository.save(trip);

        var days = dayRepository.findByTripOrderByDayNumberAsc(trip);
        var acts = new ArrayList<Activity>();
        for (var d : days) {
            acts.addAll(activityRepository.findByItineraryDayOrderByPosition(d));
        }

        var res = mapper.fromTrip(trip, days, acts);
        res.setMessage("Itinerary updated");
        return res;
    }

    @Transactional(readOnly = true)
    public GenerateItineraryResponse getById(Long itineraryId) {
        Trip trip = tripRepository.findById(itineraryId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found: " + itineraryId));

        List<ItineraryDay> days = dayRepository.findByTripOrderByDayNumberAsc(trip);

        List<Activity> activities = new ArrayList<>();
        for (ItineraryDay d : days) {
            activities.addAll(activityRepository.findByItineraryDayOrderByPosition(d));
        }

        return mapper.fromTrip(trip, days, activities);
    }

    private Map<String, Double> defaultBreakdownFor(TravelStyle style, double total) {
        return switch (style) {
            case LUXURY -> Map.of("hotel", total * 0.60, "flight", total * 0.25, "activity", total * 0.15);
            case COMFORT -> Map.of("hotel", total * 0.45, "flight", total * 0.30, "activity", total * 0.25);
            case BUDGET -> Map.of("hotel", total * 0.30, "flight", total * 0.35, "activity", total * 0.35);
        };
    }
}
