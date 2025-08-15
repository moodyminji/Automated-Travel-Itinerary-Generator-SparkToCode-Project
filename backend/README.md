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

