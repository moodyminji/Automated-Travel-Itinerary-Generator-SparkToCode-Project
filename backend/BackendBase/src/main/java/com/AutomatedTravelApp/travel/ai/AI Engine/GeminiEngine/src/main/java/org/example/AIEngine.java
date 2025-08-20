package org.example;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.AutomatedTravelApp.travel.dto.GenerateItineraryResponse;



public class AIEngine {
        public static void main(String[] args) {
            Client client = new Client();

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.5-flash",
                            "Explain how AI works in a few words",
                            null);

            System.out.println(response.text());
        }
        }

