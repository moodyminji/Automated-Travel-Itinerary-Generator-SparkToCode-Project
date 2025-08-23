package com.AutomatedTravelApp.travel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Min;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "trips", indexes = {
        @Index(name = "ix_trips_user", columnList = "user_id"),
        @Index(name = "ix_trips_destination", columnList = "destination")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Trip extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User user;

    @NotBlank
    @Column(nullable = false, length = 120)
    private String destination;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @PositiveOrZero
    @Column(precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal budgetAmount = BigDecimal.ZERO;

    @Column(length = 3, nullable = false)
    @Builder.Default
    private String budgetCurrency = "OMR";

    @Enumerated(EnumType.STRING)
    private TravelStyle travelStyle;
    
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dayNumber ASC")
    @Builder.Default
    private List<ItineraryDay> days = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "trip_budget", joinColumns = @JoinColumn(name = "trip_id"))
    @MapKeyColumn(name = "category")   // e.g. accommodation, flights, activities, food, misc
    @Column(name = "amount")
    @Builder.Default
    private Map<String, Double> budgetBreakdown = new LinkedHashMap<>();

    @ElementCollection(fetch = FetchType.EAGER, targetClass = TravelInterest.class)
    @CollectionTable(name = "trip_interests", joinColumns = @JoinColumn(name = "trip_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "interest")
    @Builder.Default
    private Set<TravelInterest> interests = new HashSet<>();

    @Min(1)
    @Column(name = "people_count")
    private Integer peopleCount;

    private double flightCost;
    private double hotelCost;
    private double activityCost;


}
