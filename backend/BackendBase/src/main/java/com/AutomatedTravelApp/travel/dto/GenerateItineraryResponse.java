package com.AutomatedTravelApp.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenerateItineraryResponse {
    private Long itineraryId;
    private String message;
}
