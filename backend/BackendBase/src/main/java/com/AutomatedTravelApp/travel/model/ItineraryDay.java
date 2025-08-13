package com.AutomatedTravelApp.travel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itinerary_days", uniqueConstraints = {
        @UniqueConstraint(name = "uk_trip_day", columnNames = {"trip_id", "dayNumber"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItineraryDay extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Trip trip;

    @Min(1)
    @Column(nullable = false)
    private int dayNumber;

    @OneToMany(mappedBy = "itineraryDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();
}
