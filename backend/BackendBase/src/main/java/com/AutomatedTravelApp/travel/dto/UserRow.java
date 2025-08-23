package com.AutomatedTravelApp.travel.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class UserRow {
    private Long id;
    private String name;
    private String email;
    private String status;  // ACTIVE / BANNED  (you can map from your User fields)
}
