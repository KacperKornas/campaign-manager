# Campaign Manager

A minimal full-stack application for managing marketing campaigns.

- **Live Demo:** [https://campaign-manager-d42d.onrender.com/](https://campaign-manager-d42d.onrender.com/)

## Tech Stack

- **Backend:** Spring Boot (Java 17) + H2 (in-memory)
- **Frontend:** React (Create React App) + Axios + react-select
- **Containerization:** Docker (multi-stage Dockerfile)

---

## Quick Start

### Clone Repository
```bash
git clone https://github.com/KacperKornas/campaign-manager.git
cd campaign-manager
```

### Run Locally (Without Docker)

1. **Backend** (port 8080):
   ```bash
   ./mvnw spring-boot:run
   ```
2. **Frontend** (port 3000):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The React app will open at [http://localhost:3000](http://localhost:3000) and proxy API calls to [http://localhost:8080](http://localhost:8080).

### Run with Docker

From the project root:
```bash
docker build -t campaign-manager .
docker run -d -p 8080:8080 campaign-manager
```
Visit [http://localhost:8080](http://localhost:8080) to see the app (both frontend and backend served by Spring Boot).

---

## Configuration

- **application.properties** (located in `src/main/resources`):
  ```properties
  spring.datasource.url=jdbc:h2:mem:campaigndb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
  spring.datasource.username=sa
  spring.datasource.password=
  spring.jpa.hibernate.ddl-auto=update
  spring.h2.console.enabled=true
  spring.h2.console.path=/h2-console
  server.port=${PORT:8080}
  spring.mvc.locale=en
  spring.mvc.locale-resolver=fixed
  ```
  - H2 console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
    - JDBC URL: `jdbc:h2:mem:campaigndb`  
    - User: `sa`  
    - Password: *(leave blank)*  
  - `server.port=${PORT:8080}` makes it compatible with hosting platforms (e.g., Render).

---

## API Endpoints

All endpoints are under `/api`.

- **Campaigns**
  - `GET  /api/campaigns`  
    - List all campaigns
  - `GET  /api/campaigns/{id}`  
    - Get a campaign by ID
  - `POST /api/campaigns`  
    - Create a new campaign (JSON body)
  - `PUT  /api/campaigns/{id}`  
    - Update an existing campaign (JSON body)
  - `DELETE /api/campaigns/{id}`  
    - Delete a campaign

- **Metadata**
  - `GET /api/keywords`  
    - Returns a JSON array of keyword strings
  - `GET /api/towns`  
    - Returns a JSON array of town names

---

## Frontend Overview

- **Location:** `frontend/src/components`
  - **CampaignList.jsx**: Displays a table of campaigns or a “No campaigns” message.
  - **CampaignForm.jsx**: Form for creating/editing campaigns; uses `react-select` for keywords (multi-select) and town (single-select).
- Validation errors from the backend (HTTP 400) appear under each form field.

---

## Validation & Error Handling

- Bean Validation (`@NotNull`, `@NotBlank`, `@Min`, etc.) in `Campaign` model.
- Invalid fields return HTTP 400 with a JSON mapping:
  ```json
  {
    "name": "must not be blank",
    "bidAmount": "must not be null",
    "radiusKm": "must be greater than or equal to 1"
  }
  ```
- Entity not found returns HTTP 404 with:
  ```json
  { "error": "Campaign not found: {id}" }
  ```

---

## Deployment Notes

- Uses a **multi-stage Dockerfile**:
  1. **frontend-build** (`node:18-alpine`): installs dependencies and builds React app.
  2. **backend-build** (`maven:3.9.9-eclipse-temurin-17`): downloads Java dependencies, copies frontend build into `src/main/resources/static`, packages Spring Boot JAR.
  3. **runtime** (`eclipse-temurin:17-jre-jammy`): runs the final JAR.
- Platform example: **Render.com**
  - Connect GitHub repo.
  - Build command: `docker build -t campaign-manager .`
  - Start command: `docker run -p 8080:8080 campaign-manager`
  - Render sets `PORT` automatically; Spring Boot uses it via `server.port=${PORT:8080}`.

---

## Notes

- In-memory H2 resets on restart—no persistent storage.
- To customize validation messages, add `src/main/resources/ValidationMessages.properties`.
- If you wish to change default language for validation, the `LocaleConfig` bean and `spring.mvc.locale=en` force English.

---

## License

*MIT License* (include a `LICENSE` file if desired).
