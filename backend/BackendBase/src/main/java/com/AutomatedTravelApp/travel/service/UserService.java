package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.model.User;
import com.AutomatedTravelApp.travel.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.AutomatedTravelApp.travel.model.Role;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public User registerUser(User user) {
        user.setRole(Role.USER); // Always USER for self-registration
        user.setEmailVerified(false);
        user.setVerificationToken(UUID.randomUUID().toString());
        // Hash password here in real apps!
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());
        return user;
    }

    public boolean verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElse(null);
        if (user == null) return false;
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return true;
    }
}