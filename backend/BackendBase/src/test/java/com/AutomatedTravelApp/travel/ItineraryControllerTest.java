package com.AutomatedTravelApp.travel;

import com.AutomatedTravelApp.travel.controller.ItineraryController;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryRequest;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.service.ItineraryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ItineraryController.class)
class ItineraryControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    private ItineraryService itineraryService;

    @Test
    void health_ok() throws Exception {
        mockMvc.perform(get("/api/itineraries/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("OK"));
    }

    @Test
    void generate_ok() throws Exception {
        when(itineraryService.generate(any(GenerateItineraryRequest.class)))
                .thenReturn(new GenerateItineraryResponse(123L, "Itinerary created"));

        String body = """
            {
              "destination": "DXB",
              "days": 3,
              "startDate": "10-09-2025",
              "endDate":   "12-09-2025",
              "interests": ["shopping","food"]
            }
            """;

        mockMvc.perform(post("/api/itineraries/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itineraryId").value(123))
                .andExpect(jsonPath("$.message").value("Itinerary created"));
    }

    @Test
    void getById_ok() throws Exception {
        when(itineraryService.getById(1L))
                .thenReturn(new GenerateItineraryResponse(1L, "Found"));

        mockMvc.perform(get("/api/itineraries/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itineraryId").value(1))
                .andExpect(jsonPath("$.message").value("Found"));
    }
}
