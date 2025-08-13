package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.Activity;
import com.AutomatedTravelApp.travel.model.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByItineraryDayOrderByPosition(ItineraryDay day);
}
