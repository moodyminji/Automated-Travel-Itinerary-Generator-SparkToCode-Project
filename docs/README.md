# Project RoamAura– Automated Travel Itinerary Generator

## 🧭 Project Overview

Project RoamAura is a full-stack web application that generates personalized travel itineraries based on user preferences, budget, and travel style. It integrates external APIs and AI-driven logic to create smart, editable day-by-day plans for travelers.

The goal is to deliver a working MVP in 3 weeks, with a modular, scalable architecture and clean user experience.

---

## 🚀 Key Features

- Trip input form: destination, dates, budget, interests
- AI/logic engine to generate balanced itineraries
- Day-by-day itinerary viewer with activity details
- Notifications and optional user login
- Admin dashboard for monitoring API usage and logs

---

## 🧰 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| **Frontend** | React + Vite                   |
| **Backend**  | Java + Spring Boot             |
| **Database** | SQL Using PostgreSQL           |
| **AI/Logic** | Rule-based engine + Gemini API |
| **DevOps**   | GitHub Actions, AWS            |
| **Testing**  | JUnit, Jest, React Testing Lib |

---

## 👥 Team Structure

| Team           | Members                                                                 |
|----------------|-------------------------------------------------------------------------|
| **Frontend**   | @Yaqeen, @Jokha, @Tasneem, @3ma1r (Lead), @Anhal                        |
| **Backend**    | @Razan, @Shahad, @Safa, @Nasser (Lead), @Rawan                          |
| **DevOps & QA**| @moodyminji (Lead), @Hamed                                                |
| **AI / Logic** | @Qais (Lead), @Suliman                                                  |

---

## 🗂️ Folder Structure
├── frontend/       # React app ├── backend/        # Spring Boot app ├── docs/           # Guides, diagrams, README ├── scripts/        # Deployment scripts └── config/         # Environment files

---


## ⚙️ Setup Instructions

### Frontend

cd frontend
npm install
npm run dev


Backend
cd backend
./mvnw spring-boot:run


Environment Variables
Create .env files in both frontend/ and backend/ with appropriate API keys and DB credentials.

📅 Timeline
| Week | Focus | 
| 0 | Repo setup, CI/CD, team onboarding | 
| 1 | Trip input, API contracts, UI scaffolding | 
| 2 | AI logic, itinerary generation, integration | 
| 3 | Notifications, admin dashboard, deployment | 



📋 License
This project is developed by Rihal for educational and internal demo purposes.

---


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



