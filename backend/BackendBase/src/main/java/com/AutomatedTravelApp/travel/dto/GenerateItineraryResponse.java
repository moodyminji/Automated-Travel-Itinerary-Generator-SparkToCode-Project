package com.AutomatedTravelApp.travel.dto;

import com.AutomatedTravelApp.travel.model.TravelInterest;
import com.AutomatedTravelApp.travel.model.TravelStyle;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;


@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateItineraryResponse {
    private Long itineraryId;
    private String message;
    private String origin;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalBudget;
    private Double estimatedCost;
    private TravelStyle travelStyle;
    private Map<String, Double> budgetBreakdown;
    private Set<TravelInterest> interests;
    private Integer peopleCount;

    private FlightDto flight;
    private AccommodationDto accommodation;
    private List<ActivityDto> activities = List.of();
    private List<ItineraryDayDto> itineraryDays = List.of();

    public GenerateItineraryResponse(Long itineraryId, String message) {
        this.itineraryId = itineraryId;
        this.message = message;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class FlightDto {
        private String airline;
        private String flightNumber;
        private String departureTime;
        private String arrivalTime;
        private Double price;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class AccommodationDto {
        private String name;
        private String location;
        private String checkIn;
        private String checkOut;
        private Double pricePerNight;
        private Double rating;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ActivityDto {
        private String name;
        private String type;
        private String location;
        private Double price;
        private Double rating;
        private Integer durationMinutes;
        private Integer dayPlanned;
    }
    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ItineraryDayDto {
        private Integer dayNumber;
        private Boolean restDay;
        private String notes;
        
    }
}
