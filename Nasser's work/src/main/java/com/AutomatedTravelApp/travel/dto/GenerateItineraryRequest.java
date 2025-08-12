package com.AutomatedTravelApp.travel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class GenerateItineraryRequest {
    @NotBlank
    private String destination;

    @Min(1)
    private int days;

    private List<String> interests;
}
