package com.AutomatedTravelApp.travel.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TravelStyle {
    LUXURY, COMFORT, BUDGET;

    @JsonCreator
    public static TravelStyle from(Object v) {
        if (v == null) return COMFORT;
        String s = v.toString().trim().toUpperCase();
        switch (s) {
            case "LUXURY": return LUXURY;
            case "COMFORT": return COMFORT;
            case "BUDGET":  return BUDGET;
            default: throw new IllegalArgumentException("Unknown travelStyle: " + v);
        }
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
