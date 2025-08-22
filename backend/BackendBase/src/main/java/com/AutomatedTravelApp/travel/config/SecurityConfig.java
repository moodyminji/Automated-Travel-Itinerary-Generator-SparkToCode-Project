package com.AutomatedTravelApp.travel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Your API is mostly public right now; lock down later if needed
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/health",
                    "/api/itineraries/health",
                    "/api/itineraries/generate",   // keep public for now
                    "/api/itineraries/**"          // or restrict later
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(Customizer.withDefaults())   // <-- enables Google login
            .logout(logout -> logout.logoutSuccessUrl("/").permitAll())
            .csrf(csrf -> csrf.disable());            // typical for JSON APIs

        return http.build();
    }
}
