package com.AutomatedTravelApp.travel.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class ServiceStatus {
    private String service;     // API Gateway, Database, Email, File Storage...
    private String status;      
    private long responseMs;    // fake or measured
}

