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
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TravelApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelApplication.class, args);
    }

    @Bean
    @Profile("!test")
    CommandLineRunner seedAdmins(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            String defaultPassword = System.getenv().getOrDefault("ADMIN_SEED_PASSWORD", "ChangeMe!123");
            Stream.of("admin1@tajawal.com", "admin2@tajawal.com", "admin3@tajawal.com")
                    .forEach(email -> {
                        if (!users.existsByEmail(email)) {
                            User u = User.builder()
                                    .email(email)
                                    .name("Admin")
                                    .passwordHash(encoder.encode(defaultPassword))
                                    .role(Role.ADMIN)
                                    .build();
                            users.save(u);
                        }
                    });
        };
    }
}
