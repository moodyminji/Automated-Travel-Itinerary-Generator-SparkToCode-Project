package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.ItineraryDay;
import com.AutomatedTravelApp.travel.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {
    List<ItineraryDay> findByTripOrderByDayNumberAsc(Trip trip);
}
