package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {}
