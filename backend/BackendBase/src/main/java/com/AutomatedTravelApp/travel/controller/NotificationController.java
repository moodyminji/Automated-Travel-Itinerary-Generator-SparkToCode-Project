package com.AutomatedTravelApp.travel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.AutomatedTravelApp.travel.model.Notification;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        // fetch notifications for user
        return List.of(); // return an empty list for now
    }
}