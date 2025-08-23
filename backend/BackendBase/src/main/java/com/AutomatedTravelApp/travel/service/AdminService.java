package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.*;
import com.AutomatedTravelApp.travel.model.LogEntry;
import com.AutomatedTravelApp.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final LogEntryRepository logEntryRepository;

    @Transactional(readOnly = true)
    public AdminSummary summary() {
        long totalUsers = userRepository.count();
        long activeUsers = totalUsers; // adjust if you have a status field
        long totalErrors = logEntryRepository.countErrors();
        int destinations = (int)tripRepository.findAll().stream()
                .map(t -> t.getDestination()==null? "" : t.getDestination().toLowerCase())
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet()).size();
        long last24h = logEntryRepository.countByCreatedAtAfter(Instant.now().minus(1, ChronoUnit.DAYS));

        return AdminSummary.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalErrors(totalErrors)
                .destinations(destinations)
                .logEntriesLast24h(last24h)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LogRow> recentLogs() {
        return logEntryRepository.findTop200ByOrderByCreatedAtDesc()
                .stream()
                .map(le -> LogRow.builder()
                        .timestamp(le.getCreatedAt())
                        .level(cap(le.getLevel()))
                        .message(le.getMessage())
                        .user(le.getUserEmail()==null? "System" : le.getUserEmail())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ErrorBucket> errorBuckets() {
        return logEntryRepository.bucketizeErrors().stream()
                .map(arr -> ErrorBucket.builder()
                        .error((String)arr[0])
                        .count((Long)arr[1])
                        .firstOccurred((Instant)arr[2])
                        .lastOccurred((Instant)arr[3])
                        .build())
                .toList();
    }

    @Transactional
    public LogRow addLog(String level, String message, String source, String userEmail) {
        LogEntry saved = logEntryRepository.save(
                LogEntry.builder()
                        .level(level==null? "INFO" : level.toUpperCase())
                        .message(message==null? "" : message)
                        .source(source==null? "System" : source)
                        .userEmail(userEmail)
                        .build()
        );
        return LogRow.builder()
                .timestamp(saved.getCreatedAt())
                .level(cap(saved.getLevel()))
                .message(saved.getMessage())
                .user(saved.getUserEmail()==null? "System" : saved.getUserEmail())
                .build();
    }

    @Transactional
    public void deleteLog(Long id) {
        logEntryRepository.deleteById(id);
    }

    // “Service Destinations” – keep it simple (mock or measure)
    @Transactional(readOnly = true)
    public List<ServiceStatus> serviceStatuses() {
        // You can measure DB ping or call /actuator/health here.
        return List.of(
            ServiceStatus.builder().service("API Gateway").status("Healthy").responseMs(45).build(),
            ServiceStatus.builder().service("Database").status("Healthy").responseMs(32).build(),
            ServiceStatus.builder().service("Email Service").status("Healthy").responseMs(78).build(),
            ServiceStatus.builder().service("File Storage").status("Healthy").responseMs(70).build()
        );
    }

    private String cap(String s) {
        if (s==null || s.isBlank()) return s;
        String t = s.toLowerCase();
        if (t.equals("warn")) t = "warning";
        return t.substring(0,1).toUpperCase() + t.substring(1);
    }
}

