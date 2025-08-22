package com.AutomatedTravelApp.travel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.AssertTrue;



@Data
public class GenerateItineraryRequest {
    @NotBlank(message = "destination is required")
    private String destination;

    @Min(1)
    private Integer days;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate endDate;

    private List<String> interests;

    private Integer budget;

    private String travelStyle;

    private Map<String, Double> budgetBreakdown;

    @AssertTrue(message = "Provide either 'days' or both 'startDate' and 'endDate'")
    public boolean isDaysOrDatesProvided() {
        boolean hasDays = days != null && days >= 1;
        boolean hasDates = startDate != null && endDate != null && !endDate.isBefore(startDate);
        return hasDays || hasDates;
    }

}

