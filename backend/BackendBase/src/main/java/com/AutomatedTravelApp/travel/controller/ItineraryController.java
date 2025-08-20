package com.AutomatedTravelApp.travel.controller;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<GenerateItineraryResponse> generate(
            @Valid @RequestBody GenerateItineraryRequest request) {
        return ResponseEntity.ok(itineraryService.generate(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenerateItineraryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itineraryService.getById(id));
    }
}
