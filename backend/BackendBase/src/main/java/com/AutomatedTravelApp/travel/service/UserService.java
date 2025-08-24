package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.model.User;
import com.AutomatedTravelApp.travel.repository.UserRepository;
import com.AutomatedTravelApp.travel.model.Role;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Simple registration, no email verification
    public User registerUser(User user) {
        user.setRole(Role.USER);

        return userRepository.save(user);
    }
}
