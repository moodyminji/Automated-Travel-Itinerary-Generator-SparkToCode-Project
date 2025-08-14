package com.AutomatedTravelApp.travel.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "trip_segments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@ToString(exclude = "itinerary")
@EqualsAndHashCode(exclude = "itinerary")
public class TripSegment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayTitle;
    private String activity;
    private String location;
    private LocalTime startTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id")
    @JsonBackReference
    private Itinerary itinerary;
}
