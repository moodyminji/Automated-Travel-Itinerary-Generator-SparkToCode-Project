package com.AutomatedTravelApp.travel.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="log_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LogEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=20)
    private String level;       // INFO, WARNING, ERROR

    @Column(nullable=false, length=1000)
    private String message;

    @Column(nullable=false, length=50)
    private String source;      // System / API / DB / etc.

    @Column(name="user_email", length=160)
    private String userEmail;

    @Builder.Default
    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt = Instant.now();
}

