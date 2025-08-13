package com.AutomatedTravelApp.travel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "activities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Activity extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private ItineraryDay itineraryDay;

    @Column(nullable = false)
    @Builder.Default
    private int position = 1;

    @NotBlank
    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 160)
    private String location;

    @PositiveOrZero
    @Column(precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal costAmount = BigDecimal.ZERO;

    @Column(length = 3, nullable = false)
    @Builder.Default
    private String costCurrency = "OMR";

    private LocalTime startTime;

    @PositiveOrZero
    @Builder.Default
    private Integer durationMinutes = 0;

    @Column(length = 1000)
    private String notes;
}
