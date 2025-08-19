package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.*;
import com.AutomatedTravelApp.travel.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItineraryServiceTest {

    @Mock ItineraryRepository itineraryRepository;
    @Mock UserRepository userRepository;
    @Mock TripRepository tripRepository;
    @Mock ItineraryDayRepository dayRepository;
    @Mock ActivityRepository activityRepository;

    @InjectMocks
    ItineraryService service;

    @Test
    void generate_persistsAndReturnsId() {
        // --- arrange ---
        GenerateItineraryRequest req = new GenerateItineraryRequest();
        req.setDestination("Paris");
        req.setDays(3);
        req.setInterests(List.of("museums", "food"));

        // user: not found first, then saved
        when(userRepository.findByEmail("demo@user.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(10L);
            return u;
        });

        // itinerary save returns an entity with ID so the service can put it in the response
        when(itineraryRepository.save(any(Itinerary.class))).thenAnswer(inv -> {
            Itinerary it = inv.getArgument(0);
            it.setId(123L);
            return it;
        });

        // trip/day/activity saves just echo back with ids (keeps the service happy)
        when(tripRepository.save(any(Trip.class))).thenAnswer(inv -> {
            Trip t = inv.getArgument(0);
            t.setId(20L);
            return t;
        });
        when(dayRepository.save(any(ItineraryDay.class))).thenAnswer(inv -> {
            ItineraryDay d = inv.getArgument(0);
            d.setId(30L);
            return d;
        });
        when(activityRepository.save(any(Activity.class))).thenAnswer(inv -> {
            Activity a = inv.getArgument(0);
            a.setId(40L);
            return a;
        });

        // --- act ---
        GenerateItineraryResponse res = service.generate(req);

        // --- assert ---
        assertThat(res).isNotNull();
        assertThat(res.getItineraryId()).isEqualTo(123L);
        assertThat(res.getMessage()).contains("Stub itinerary");

        verify(itineraryRepository, times(1)).save(any(Itinerary.class));
        verify(userRepository, times(1)).findByEmail("demo@user.com");
        verify(userRepository, times(1)).save(any(User.class));
        verify(tripRepository, times(1)).save(any(Trip.class));
        verify(dayRepository, times(1)).save(any(ItineraryDay.class));
        verify(activityRepository, times(1)).save(any(Activity.class));
        verifyNoMoreInteractions(itineraryRepository, userRepository, tripRepository, dayRepository, activityRepository);
    }

    @Test
    void generate_usesLocalHighlightsWhenInterestsEmpty() {
        GenerateItineraryRequest req = new GenerateItineraryRequest();
        req.setDestination("Rome");
        req.setDays(1);
        req.setInterests(List.of()); // empty

        when(userRepository.findByEmail("demo@user.com")).thenReturn(Optional.of(new User()));
        when(itineraryRepository.save(any(Itinerary.class))).thenAnswer(inv -> {
            Itinerary it = inv.getArgument(0);
            it.setId(1L);
            return it;
        });
        when(tripRepository.save(any(Trip.class))).thenAnswer(inv -> {
            Trip t = inv.getArgument(0);
            t.setId(2L);
            return t;
        });
        when(dayRepository.save(any(ItineraryDay.class))).thenAnswer(inv -> {
            ItineraryDay d = inv.getArgument(0);
            d.setId(3L);
            return d;
        });
        when(activityRepository.save(any(Activity.class))).thenAnswer(inv -> {
            Activity a = inv.getArgument(0);
            a.setId(4L);

            return a;
        });

        GenerateItineraryResponse res = service.generate(req);

        assertThat(res.getItineraryId()).isEqualTo(1L);

    }
}
