package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.Activity;
import com.AutomatedTravelApp.travel.model.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByItineraryDayOrderByPosition(ItineraryDay day);

    @Query("select a from Activity a where a.itineraryDay.trip.id = :tripId order by a.itineraryDay.dayNumber asc, a.position asc")
    List<Activity> findByItineraryDayTripId(@Param("tripId") Long tripId);
}
