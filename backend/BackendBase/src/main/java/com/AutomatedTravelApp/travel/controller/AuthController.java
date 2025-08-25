package com.AutomatedTravelApp.travel.controller;

import com.AutomatedTravelApp.travel.model.User;
import com.AutomatedTravelApp.travel.service.UserService;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Normal sign-up (email/password stored by your service)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("Registration successful!");
    }


    @GetMapping("/me")
    public Map<String, Object> me(Principal principal) {
        return (principal == null)
                ? Map.of("authenticated", false)
                : Map.of("authenticated", true, "username", principal.getName());
    }
}
