package com.AutomatedTravelApp.travel.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * Mirrors the JSON shape AIEngine's prompt instructs Gemini to return.
 * Used only to parse AIEngine.finalJson into something we can persist.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiItineraryJson {

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiActivity {
        private String id;
        private String name;
        private String start;
        private String end;
        private Double cost;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiDay {
        private String date;
        private List<AiActivity> activities;
        private Double dayCost;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiFlight {
        private String id;
        private String departure;
        private String arrival;
        private Double cost;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiHotel {
        private String id;
        private String name;
        private String checkIn;
        private String checkOut;
        private Double cost;
    }

    private String itineraryId;
    private List<AiDay> days;
    private Double totalCost;
    private AiFlight flight;
    private AiHotel hotel;

    public String getItineraryId() { return itineraryId; }
    public void setItineraryId(String itineraryId) { this.itineraryId = itineraryId; }
    public List<AiDay> getDays() { return days; }
    public void setDays(List<AiDay> days) { this.days = days; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public AiFlight getFlight() { return flight; }
    public void setFlight(AiFlight flight) { this.flight = flight; }
    public AiHotel getHotel() { return hotel; }
    public void setHotel(AiHotel hotel) { this.hotel = hotel; }
}