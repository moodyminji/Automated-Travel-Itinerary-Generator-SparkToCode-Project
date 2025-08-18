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

# Backend – Automated Travel Itinerary Generator

This backend service powers the **Automated Travel Itinerary Generator** project.  
It provides REST API endpoints for generating trip itineraries, managing trips, and integrating with the frontend.

---

## 📂 Project Structure

```

backend/
├── BackendBase/           # Spring Boot application root
│    ├── mvnw               # Maven wrapper
│    ├── pom.xml            # Maven dependencies & build config
│    └── src/               # Java source code
│         ├── main/java/    # Application code
│         └── test/java/    # Unit tests
└── README.md               # This file

````

---

## ⚙️ Prerequisites

Before running the backend, ensure you have:

- **Java 17** (Temurin recommended)
- **Maven Wrapper** (included as `mvnw` inside `backend/BackendBase`)
- **Git** for version control
- **Internet connection** for dependency download

---

## 🚀 Running the Application

From the **project root**, run:

```bash
cd backend/BackendBase
./mvnw spring-boot:run
````

For **Windows**:

```powershell
cd backend\BackendBase
mvnw spring-boot:run
```

The application should start on:
**[http://localhost:8080](http://localhost:8080)**

---

## 🧪 Running Tests

To execute unit tests:

```bash
cd backend/BackendBase
./mvnw clean test
```

---

## 🛠 Common Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `./mvnw clean install`   | Cleans, compiles, and packages the application |
| `./mvnw test`            | Runs unit and integration tests                |
| `./mvnw spring-boot:run` | Starts the Spring Boot application             |
| `./mvnw dependency:tree` | Shows Maven dependency hierarchy               |

---

## 📡 API Endpoints (Example)

| Method | Endpoint              | Description                                            |
| ------ | --------------------- | ------------------------------------------------------ |
| `GET`  | `/itinerary/test-id`  | Returns a sample itinerary                             |
| `POST` | `/generate-itinerary` | Generates itinerary (stub) using provided request data |

---

## 📝 Development Notes

* The backend uses **Spring Boot** for REST API development.
* **DTOs** (Data Transfer Objects) are used for request and response payloads.
* **Maven Wrapper** ensures consistent builds without requiring Maven installation.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```




