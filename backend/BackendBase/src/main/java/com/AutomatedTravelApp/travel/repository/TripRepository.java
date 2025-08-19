package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.Trip;
import com.AutomatedTravelApp.travel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser(User user);
    List<Trip> findByDestinationIgnoreCase(String destination);
    List<Trip> findByStartDateBetween(LocalDate from, LocalDate to);
}
