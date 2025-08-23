package com.AutomatedTravelApp.travel.controller;

import com.AutomatedTravelApp.travel.dto.*;
import com.AutomatedTravelApp.travel.model.User;
import com.AutomatedTravelApp.travel.repository.UserRepository;
import com.AutomatedTravelApp.travel.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    // Cards summary
    @GetMapping("/summary")
    public AdminSummary summary() {
        return adminService.summary();
    }

    // Application Logs (table)
    @GetMapping("/logs")
    public List<LogRow> logs() {
        return adminService.recentLogs();
    }

    // Error Monitor (buckets)
    @GetMapping("/errors")
    public List<ErrorBucket> errors() {
        return adminService.errorBuckets();
    }

    // Add a log (for testing/export)
    @PostMapping("/logs")
    public LogRow addLog(@RequestParam(defaultValue="INFO") String level,
                            @RequestParam String message,
                            @RequestParam(defaultValue="System") String source,
                            @RequestParam(required=false) String userEmail) {
        return adminService.addLog(level, message, source, userEmail);
    }

    @DeleteMapping("/logs/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLog(@PathVariable Long id) {
        adminService.deleteLog(id);
    }

    // Service Destinations
    @GetMapping("/services")
    public List<ServiceStatus> services() {
        return adminService.serviceStatuses();
    }

    // --- User management (simple list + ban/unban) ---
    @GetMapping("/users")
    public List<UserRow> users() {
        return userRepository.findAll().stream()
                .map(u -> UserRow.builder()
                        .id(u.getId())
                        .name(null) // fill if you add 'name' on User
                        .email(u.getEmail())
                        .status("ACTIVE") // change if you add a 'status' column
                        .build())
                .toList();
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<?> ban(@PathVariable Long id) {
        // add a 'banned' or 'status' field on User to persist
        User u = userRepository.findById(id).orElseThrow();
        // u.setStatus("BANNED");
        userRepository.save(u);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<?> unban(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        // u.setStatus("ACTIVE");
        userRepository.save(u);
        return ResponseEntity.ok().build();
    }
}

