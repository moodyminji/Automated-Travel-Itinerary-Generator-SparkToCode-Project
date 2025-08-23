package com.AutomatedTravelApp.travel.dto;

import lombok.*;
import java.time.Instant;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class LogRow {
    private Instant timestamp;
    private String level;     // Info/Warning/Error
    private String message;
    private String user;      // email or "System"
}

