package com.AutomatedTravelApp.travel;

import java.util.stream.Stream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.AutomatedTravelApp.travel.model.User;
import com.AutomatedTravelApp.travel.model.Role;
import com.AutomatedTravelApp.travel.repository.UserRepository;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
public class TravelApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelApplication.class, args);
    }

    @Bean
    @Profile("!test")
    CommandLineRunner seedAdmins(UserRepository users) {
        return args -> {
            Stream.of("admin1@tajawal.com", "admin2@tajawal.com", "admin3@tajawal.com")
                    .forEach(email -> {
                        if (!users.existsByEmail(email)) {
                            User u = User.builder()
                                    .email(email)
                                    // TODO: replace with a real hashed password (e.g., BCrypt)
                                    .passwordHash("str0ngPas$")
                                    .role(Role.ADMIN)
                                    .build();
                            users.save(u);
                        }
                    });
        };
    }
}
