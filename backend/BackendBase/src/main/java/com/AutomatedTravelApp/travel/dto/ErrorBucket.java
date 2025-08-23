package com.AutomatedTravelApp.travel.dto;

import lombok.*;
import java.time.Instant;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class ErrorBucket {
    private String error;           // message pattern
    private long count;
    private Instant firstOccurred;
    private Instant lastOccurred;
}

