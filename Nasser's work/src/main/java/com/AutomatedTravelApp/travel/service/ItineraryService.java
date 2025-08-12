package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.Itinerary;
import com.AutomatedTravelApp.travel.model.TripSegment;
import com.AutomatedTravelApp.travel.repository.ItineraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;

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
        return new GenerateItineraryResponse(it.getId(), "Stub itinerary created");
    }
}
