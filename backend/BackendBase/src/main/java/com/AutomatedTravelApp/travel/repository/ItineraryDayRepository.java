package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.ItineraryDay;
import com.AutomatedTravelApp.travel.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {
    List<ItineraryDay> findByTripOrderByDayNumberAsc(Trip trip);

    @Query("select d from ItineraryDay d where d.trip.id = :tripId order by d.dayNumber asc")
    List<ItineraryDay> findByTripId(@Param("tripId") Long tripId);
}
