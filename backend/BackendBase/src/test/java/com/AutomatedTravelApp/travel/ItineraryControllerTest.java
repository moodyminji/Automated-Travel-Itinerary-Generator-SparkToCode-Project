package com.AutomatedTravelApp.travel;

import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;
import com.AutomatedTravelApp.travel.service.ItineraryService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ItineraryControllerTest {

    @Autowired
    MockMvc mvc;

    @MockBean
    ItineraryService service;

    @Test
    void health_ok() throws Exception {
        mvc.perform(get("/api/itineraries/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("OK"));
    }

    @Test
    void generate_ok() throws Exception {
        // Mock service response
        var resp = new GenerateItineraryResponse(1L, "Itinerary created successfully");
        when(service.generate(any())).thenReturn(resp);

        // Example request body
        var body = """
          {"destination":"DXB","days":4,"startDate":"10-09-2025","endDate":"14-09-2025","interests":["beach","shopping","food"]}
          """;

        mvc.perform(post("/api/itineraries/generate")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itineraryId").value(1))
                .andExpect(jsonPath("$.message").value("Itinerary created successfully"));
    }
}
