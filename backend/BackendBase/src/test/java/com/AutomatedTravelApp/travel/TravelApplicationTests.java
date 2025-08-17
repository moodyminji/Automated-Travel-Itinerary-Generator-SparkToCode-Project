package com.AutomatedTravelApp.travel;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;



@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = Replace.ANY)
class TravelApplicationTests {

	@Test
	void contextLoads() {
	}

}
