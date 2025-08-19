package com.AutomatedTravelApp.travel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@AllArgsConstructor
public class GenerateItineraryResponse {
    private Long itineraryId;
    private String message;
    private String origin;         // optional
    private String destination;    // optional
    private LocalDate startDate;   // optional
    private LocalDate endDate;     // optional
    private Double totalBudget;    // optional
    private Double estimatedCost;  // optional

    private FlightDto flight;                  // optional
    private AccommodationDto accommodation;    // optional
    private List<ActivityDto> activities;      // optional
    private List<ItineraryDayDto> itineraryDays; // optional

    public GenerateItineraryResponse() {
    }
    public GenerateItineraryResponse(Long itineraryId, String message) {
        this.itineraryId = itineraryId;
        this.message = message;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class FlightDto {
        private String airline, flightNumber, departureTime, arrivalTime;
        private Double price;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class AccommodationDto {
        private String name, location, checkIn, checkOut;
        private Double pricePerNight, rating;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ActivityDto {
        private String name, type, location;
        private Double price, rating;
        private Integer durationMinutes, dayPlanned;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ItineraryDayDto {
        private Integer dayNumber; private Boolean restDay; private String notes;
    }
}
