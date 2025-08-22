package com.AutomatedTravelApp.travel.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TravelInterest {
    BEACH, FOOD, NATURE, RELAXATION, HISTORY, SHOPPING, ENTERTAINMENT;

    @JsonCreator
    public static TravelInterest from(Object v) {
        if (v == null) return null;
        String s = v.toString().trim();
        for (TravelInterest t : values()) {
            if (t.name().equalsIgnoreCase(s)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Unknown travelInterest: " + v);
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
