
# API Endpoints -- Done By Shahad Al Harthy 

---

## 1. POST `/generate-itinerary`
**What it does:**  
Creates a new trip and its associated itinerary based on trip details and optional preferences.

**Request body:**  
```json
{
  "userId": "string", 
  "trip": {
    "origin": "string",
    "destination": "string",
    "startDate": "DD-MM-YYYY",
    "endDate": "DD-MM-YYYY",
    "budget": { "amount": 0, "currency": "OMR" }
  },
  "preferences": {
    "activityTypes": ["string"],
    "maxDailyMinutes": 0,
    "accommodationStyle": "string",
    "dietaryRestrictions": ["string"],
    "avoidConsecutiveFullDays": true
  }
}
```

**Response (201 Created):**  
```json
{
  "itineraryId": "string",
  "tripId": "string",
  "summary": { "days": 0, "nights": 0, "totalEstimatedCost": 0, "currency": "OMR" },
  "days": [
    {
      "dayNumber": 1,
      "date": "DD-MM-YYYY",
      "restDay": false,
      "items": [
        {
          "type": "flight",
          "flightNumber": "string",
          "airline": "string",
          "departureTime": "ISO date-time",
          "arrivalTime": "ISO date-time",
          "price": 0
        },
        {
          "type": "activity",
          "name": "string",
          "location": "string",
          "price": 0,
          "rating": 0,
          "durationMinutes": 0,
          "dayPlanned": "DD-MM-YYYY"
        }
      ]
    }
  ],
  "createdAt": "ISO date-time"
}
```

---

## 2. GET `/itinerary/:id`
**What it does:**  
Fetches an existing itinerary and all related trip details.

**Path parameter:**  
- `id` – itinerary ID

**Response (200 OK):**  
```json
{
  "itineraryId": "string",
  "trip": {
    "origin": "string",
    "destination": "string",
    "startDate": "DD-MM-YYYY",
    "endDate": "DD-MM-YYYY",
    "budget": { "amount": 0, "currency": "OMR" }
  },
  "days": [
    {
      "dayNumber": 1,
      "restDay": false,
      "notes": "string",
      "items": []
    }
  ],
  "updatedAt": "ISO date-time",
  "notes": "string"
}
```

---

## 3. POST `/save-itinerary`
**What it does:**  
Saves updates to an existing itinerary (day changes, notes, etc.).

**Request body:**  
```json
{
  "itineraryId": "string",
  "days": [
    {
      "dayNumber": 2,
      "restDay": true,
      "notes": "Recover from travel"
    }
  ],
  "notes": "string"
}
```

**Response (200 OK):**  
```json
{
  "status": "saved",
  "itineraryId": "string",
  "updatedAt": "ISO date-time"
}
```