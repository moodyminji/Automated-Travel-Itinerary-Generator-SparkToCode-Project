package com.AutomatedTravelApp.travel.dto;

import com.AutomatedTravelApp.travel.model.TravelInterest;
import com.AutomatedTravelApp.travel.model.TravelStyle;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import jakarta.validation.constraints.NotNull;

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


    private Integer budget;

    @NotNull(message = "travelStyle is required")
    private TravelStyle travelStyle;

    private Map<String, Double> budgetBreakdown;

    @NotNull
    private Set<TravelInterest> interests;

    @Min(1)
    private Integer peopleCount;

    @AssertTrue(message = "Provide either 'days' or both 'startDate' and 'endDate'")
    public boolean isDaysOrDatesProvided() {
        boolean hasDays = days != null && days >= 1;
        boolean hasDates = startDate != null && endDate != null && !endDate.isBefore(startDate);
        return hasDays || hasDates;
    }

}

