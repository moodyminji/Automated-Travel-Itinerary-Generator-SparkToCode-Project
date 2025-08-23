package com.AutomatedTravelApp.travel.controller;

import com.AutomatedTravelApp.travel.dto.BudgetBreakdown;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @PostMapping("/generate")
    public ResponseEntity<GenerateItineraryResponse> generate(@Valid @RequestBody GenerateItineraryRequest request) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be on/after startDate");
        }
        return ResponseEntity.ok(itineraryService.generate(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenerateItineraryResponse> getById(@PathVariable("id") Long id) {
        // Requires: public GenerateItineraryResponse getById(Long) in ItineraryService
        return ResponseEntity.ok(itineraryService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenerateItineraryResponse> updateItinerary(
            @PathVariable("id") Long id,
            @RequestBody GenerateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.updateItinerary(id, request));
    }

    @GetMapping("/{id}/budget")
    public BudgetBreakdown getBudget(@PathVariable("id") Long id) {
        GenerateItineraryResponse response = itineraryService.getById(id);

        BudgetBreakdown breakdown = new BudgetBreakdown();
        if (response != null && response.getBudgetBreakdown() != null) {
            breakdown.flightCost   = response.getBudgetBreakdown().getOrDefault("flight",   0.0);
            breakdown.hotelCost    = response.getBudgetBreakdown().getOrDefault("hotel",    0.0);
            breakdown.activityCost = response.getBudgetBreakdown().getOrDefault("activity", 0.0);
        } else {
            breakdown.flightCost = 0.0;
            breakdown.hotelCost = 0.0;
            breakdown.activityCost = 0.0;
        }
        return breakdown;
    }
}
