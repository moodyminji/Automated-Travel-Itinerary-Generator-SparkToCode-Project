package com.AutomatedTravelApp.travel.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AdminSummary {
    private long totalUsers;
    private long activeUsers;
    private long totalErrors;
    private int destinations;     
    private long logEntriesLast24h;
}

