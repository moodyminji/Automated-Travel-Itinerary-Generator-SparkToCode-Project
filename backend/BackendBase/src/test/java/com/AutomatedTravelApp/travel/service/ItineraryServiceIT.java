package com.AutomatedTravelApp.travel.service;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.model.Itinerary;
import com.AutomatedTravelApp.travel.repository.ItineraryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class ItineraryServiceIT {

    @Autowired ItineraryService service;
    @Autowired ItineraryRepository itineraryRepository;

    @Test
    void generate_createsItineraryInDb() {
        GenerateItineraryRequest req = new GenerateItineraryRequest();
        req.setDestination("Tokyo");
        req.setDays(2);
        req.setInterests(List.of("sushi", "temples"));

        GenerateItineraryResponse res = service.generate(req);

        assertThat(res.getItineraryId()).isNotNull();

        Itinerary saved = itineraryRepository.findById(res.getItineraryId()).orElseThrow();
        assertThat(saved.getDestination()).isEqualTo("Tokyo");
        assertThat(saved.getSegments()).isNotEmpty();
    }
}
