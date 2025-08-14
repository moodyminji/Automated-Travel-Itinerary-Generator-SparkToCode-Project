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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ItineraryDayRepository dayRepository;
    private final ActivityRepository activityRepository;

    public ItineraryRepository getItineraryRepository() {
        return itineraryRepository;
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public TripRepository getTripRepository() {
        return tripRepository;
    }

    public ItineraryDayRepository getDayRepository() {
        return dayRepository;
    }

    public ActivityRepository getActivityRepository() {
        return activityRepository;
    }

    @Transactional
    public GenerateItineraryResponse generate(GenerateItineraryRequest req) {
        Itinerary it = Itinerary.builder()
                .title(req.getDestination() + " Trip")
                .destination(req.getDestination())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(Math.max(req.getDays(), 1)))
                .build();

        String interests = Optional.ofNullable(req.getInterests())
                .filter(list -> !list.isEmpty())
                .map(list -> String.join(", ", list))
                .orElse("local highlights");

        TripSegment d1 = TripSegment.builder()
                .dayTitle("Day 1")
                .activity("Welcome walk + " + interests)
                .location(req.getDestination())
                .itinerary(it)
                .build();

        it.getSegments().add(d1);

        it = itineraryRepository.save(it);
        persistCoreEntities(req, it);
        return new GenerateItineraryResponse(it.getId(), "Stub itinerary created");
    }

    private void persistCoreEntities(GenerateItineraryRequest req, Itinerary it) {
        // 1) user (find-or-create)
        User user = userRepository.findByEmail("demo@user.com").orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail("demo@user.com");
            user.setPasswordHash("hashed");
            user = userRepository.save(user);
        }

        // 2) build trip dates from 'days' since request has no start/end
        LocalDate start = LocalDate.now();
        int days = Math.max(1, req.getDays());
        LocalDate end = start.plusDays(days);

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setDestination(req.getDestination());
        trip.setStartDate(start);
        trip.setEndDate(end);
        trip.setBudgetAmount(BigDecimal.ZERO);  // no budget in request yet
        trip.setBudgetCurrency("OMR");
        trip = tripRepository.save(trip);

        ItineraryDay day1 = new ItineraryDay();
        day1.setTrip(trip);
        day1.setDayNumber(1);
        day1 = dayRepository.save(day1);

        String interests = (req.getInterests() != null && !req.getInterests().isEmpty())
                ? String.join(", ", req.getInterests())
                : "local highlights";

        Activity a = new Activity();
        a.setItineraryDay(day1);
        a.setPosition(1);
        a.setName("Welcome walk + " + interests);
        a.setLocation(req.getDestination());
        a.setCostAmount(BigDecimal.ZERO);
        a.setCostCurrency("OMR");
        a.setDurationMinutes(90);
        activityRepository.save(a);
    }

    private LocalDate parseDdMmYyyy(String s, LocalDate fallback) {
        try {
            if (s == null || s.isBlank()) return fallback;
            String[] p = s.split("-");
            return LocalDate.of(Integer.parseInt(p[2]), Integer.parseInt(p[1]), Integer.parseInt(p[0]));
        } catch (Exception e) {
            return fallback;
        }
    }

    private BigDecimal toBigDecimal(Number n) {
        if (n == null) return BigDecimal.ZERO;
        return new BigDecimal(String.valueOf(n));
    }

}
