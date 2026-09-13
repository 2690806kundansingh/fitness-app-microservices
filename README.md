# 🏋️ AI-Powered Fitness & Wellness Microservices Platform

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2024.0.0-green.svg)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Keycloak](https://img.shields.io/badge/Keycloak-24-red.svg)](https://www.keycloak.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP-orange.svg)](https://www.rabbitmq.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-purple.svg)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

> An enterprise-grade, event-driven microservices ecosystem combining workout telemetry tracking, streak gamification, and asynchronous AI athletic coaching powered by Google Gemini.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Microservices Ecosystem](#-microservices-ecosystem)
- [Technology Stack](#-technology-stack)
- [How to Run the Project](#-how-to-run-the-project)
- [Interview Preparation Guide (Step-by-Step)](#-interview-preparation-guide-step-by-step)
  - [STEP 1: The 60-Second Elevator Pitch](#step-1-the-60-second-elevator-pitch)
  - [STEP 2: Core Objectives & Business Impact](#step-2-core-objectives--business-impact)
  - [STEP 3: Microservices Deep-Dive](#step-3-microservices-deep-dive)
  - [STEP 4: Real-World Request Flow (Log Workout)](#step-4-real-world-request-flow-log-workout)
  - [STEP 5: Key Architectural Decisions](#step-5-key-architectural-decisions)
  - [STEP 6: Top 10 Technical Interview Questions & Answers](#step-6-top-10-technical-interview-questions--answers)
- [Downloadable Resources](#-downloadable-resources)

---

## 🌟 Project Overview

The **AI-Powered Fitness Application** bridges the gap between raw biometric activity tracking and actionable sports science recommendations.

### Key Capabilities:
- **Stateless Authentication:** Enterprise OAuth2 / OpenID Connect security with Keycloak 24 using the **PKCE (Proof Key for Code Exchange)** flow.
- **Asynchronous Telemetry Ingestion:** Users log workouts (Running, Cycling, HIIT, Strength) and get an immediate HTTP `201 Created` response (<40ms) while data is processed in the background.
- **Event-Driven AI Recommendations:** RabbitMQ message bus triggers the **AI Service**, which calls **Google Gemini Generative AI** to analyze heart rate zones, caloric burn efficiency, pacing cadence, and injury prevention.
- **FitBot (24/7 AI Coach):** Interactive chatbot supporting English and Hinglish gym coaching with dynamic quick replies.
- **Gamified Daily Streaks:** Habit tracking module for hydration, sleep, and active minutes with consecutive streak computation.
- **Polyglot Persistence:** PostgreSQL for relational user accounts & streaks; MongoDB for unstructured workouts and AI conversation trees.

---

## 🏛️ System Architecture

```
               +--------------------------------------------------------+
               |                  React 19 + Vite Frontend              |
               |         (OAuth 2.0 PKCE Flow via Keycloak Identity)    |
               +---------------------------+----------------------------+
                                           |
                                [HTTPS / JSON Requests]
                                           |
                                           v
               +--------------------------------------------------------+
               |            Spring Cloud API Gateway (Port 8085)        |
               |  - Validates Keycloak JWT against JWKS Public Keys     |
               |  - Dynamic Route Resolution via Eureka Registry        |
               |  - Centralized CORS & Header Management                |
               +---------------------------+----------------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
         v                                 v                                 v
+------------------+             +--------------------+            +--------------------+
|   USER-SERVICE   |             |  ACTIVITY-SERVICE  |            |     AI-SERVICE     |
|   (Port 8081)    |             |    (Port 8082)     |            |    (Port 8083)     |
| - Profiles       |             | - Workout Logging  |            | - Event Consumer   |
| - Daily Streaks  |<--(WebClient| - Telemetry CRUD   |            | - Gemini LLM API   |
| - Daily Progress |    Validate)| - Sync User Check  |            | - FitBot Chatbot   |
| (PostgreSQL/H2)  |             | (MongoDB)          |            | (MongoDB)          |
+------------------+             +---------+----------+            +---------^----------+
                                           |                                 |
                                    [Publish Event]                  [Consume Event]
                                           |                                 |
                                           +--------> [ RABBITMQ ] ----------+
                                                      fitness.exchange
                                                      activity.queue
```

### Supporting Infrastructure Services:
1. **Eureka Server (`:8761`):** Dynamic service registration, heartbeats, and client-side load balancing.
2. **Config Server (`:8888`):** Centralized configuration management across environments.
3. **Keycloak (`:8181`):** Identity Provider managing the `fitness-oauth2` realm.
4. **RabbitMQ (`:5672` / `:15672`):** AMQP message broker for decoupled inter-service events.

---

## 📦 Microservices Ecosystem

| Service | Port | Database | Primary Responsibility |
|---|---|---|---|
| **`gateway`** | `8085` | — | Spring Cloud Gateway, JWT authentication filter, CORS filter, dynamic proxy routes. |
| **`eureka`** | `8761` | In-memory | Netflix Eureka discovery registry for all downstream instances. |
| **`configserver`** | `8888` | Local/Git | Centralized Spring Cloud configuration repository. |
| **`userservice`** | `8081` | PostgreSQL / H2 | User profile management, streak algorithms, daily hydration & sleep tracking. |
| **`activityservice`** | `8082` | MongoDB | Workout logging, dynamic telemetry metrics, synchronous user validation, RabbitMQ producer. |
| **`aiservice`** | `8083` | MongoDB | RabbitMQ consumer, Google Gemini integration, fallback recommendation engine, FitBot chat. |
| **`fitness-app-frontend`** | `5173 / 80` | LocalStorage/Redux | React 19 SPA with Material UI, live chat, interactive dashboards, notification badges. |

---

## 🛠️ Technology Stack

- **Backend:** Java 17, Spring Boot 3.4.3, Spring Cloud (2024.0.0), Spring Data JPA, Spring Data MongoDB, Spring WebFlux (`WebClient`), Spring AMQP.
- **Frontend:** React 19, Vite, Redux Toolkit, Material-UI (MUI), `react-oauth2-code-pkce`, Axios.
- **Security:** Keycloak 24.0.1 (OAuth2.0 / OpenID Connect, PKCE, JWT).
- **Messaging:** RabbitMQ 3.x with Topic Exchange (`fitness.exchange`) and Direct Queue (`activity.queue`).
- **Databases:** PostgreSQL (Relational) + MongoDB 6.0 (NoSQL).
- **AI / LLM:** Google Gemini API (`gemini-1.5-flash` / Generative Language API).
- **Containerization & Networking:** Docker, Docker Compose, Nginx, Cloudflare Tunnel.

---

## 🚀 How to Run the Project

### Prerequisites:
- Java 17+ installed
- Docker & Docker Compose installed
- Maven 3.9+ (or use `./mvnw`)
- Node.js 18+ and npm

### 1. Launch with Docker Compose (Production Setup)
```bash
# Start all microservices, databases, Keycloak, and RabbitMQ
docker compose -f docker-compose.prod.yml up -d --build
```

### 2. Verify Service Health:
- **API Gateway:** `http://localhost:8085`
- **Eureka Dashboard:** `http://localhost:8761`
- **RabbitMQ Management:** `http://localhost:15672` (User: `guest`, Pass: `guest`)
- **Keycloak Admin:** `http://localhost:8181` (User: `admin`, Pass: `admin`)
- **React Frontend:** `http://localhost:5173` or `http://localhost:80`

---

# 🎓 Interview Preparation Guide (Step-by-Step)

This section provides the exact script and talking points to present this project in a technical interview with maximum confidence.

---

### STEP 1: The 60-Second Elevator Pitch
*When the interviewer asks: "Tell me about your project."*

> "I developed an enterprise-grade, event-driven **AI-Powered Fitness & Wellness Microservices Application** using **Java 17, Spring Boot 3, Spring Cloud, RabbitMQ, Keycloak OAuth2, and React 19**.
> 
> The core objective of the platform is to automate personalized athletic coaching. When athletes log their activities—such as running, cycling, or strength training—the platform asynchronously processes their physiological telemetry via **RabbitMQ** and leverages **Google Gemini Generative AI** to provide actionable recovery advice, heart rate zone guidance, and pacing improvements.
> 
> Architecturally, it follows a clean microservices pattern featuring an **API Gateway, Netflix Eureka for service discovery, Spring Cloud Config Server, and Polyglot Persistence** using PostgreSQL for relational user transactions and MongoDB for flexible telemetry data and AI chat interactions."

---

### STEP 2: Core Objectives & Business Impact
1. **Eliminating UI Blocking Latency:** LLM calls take 2–4 seconds. Direct synchronous HTTP calls freeze user interfaces. By introducing **RabbitMQ Event-Driven Architecture**, workout logging response time dropped to **<40ms**.
2. **Personalized Athletic Feedback:** Instead of merely displaying raw metrics, Gemini generates sports-science insights (aerobic vs. anaerobic zone expenditure, cadence guidance, injury prevention).
3. **Enterprise IAM:** Replaced vulnerable custom credentials with **Keycloak SSO** using OAuth 2.0 PKCE flow.
4. **Resilience & High Availability:** Microservices are decoupled; if the AI service or Gemini API experiences downtime, core workout and user features remain 100% available.

---

### STEP 3: Microservices Deep-Dive

#### 1. API Gateway (`:8085`)
- Acts as the single entry point for all frontend requests.
- Validates Keycloak JWT token signatures using the JWK Set URI (`/protocol/openid-connect/certs`).
- Dynamically proxies traffic to `USER-SERVICE`, `ACTIVITY-SERVICE`, and `AI-SERVICE` via Eureka service lookup (`lb://`).
- Manages centralized CORS configuration so downstream services stay clean.

#### 2. User Service (`:8081`)
- Manages user profiles, fitness goals, and biometric targets.
- **Daily Streak Algorithm:** Calculates consecutive active days. If a user logs habits on consecutive dates, the streak increments; missing more than 24 hours resets it to 1.
- Backed by PostgreSQL with Spring Data JPA for ACID compliance.

#### 3. Activity Service (`:8082`)
- Handles CRUD for workout sessions (Running, Cycling, Weight Training, etc.).
- **Synchronous Check:** Uses Spring's non-blocking `WebClient` to call `UserService` (`/api/users/{userId}/validate`) to verify user status before persisting records.
- **Asynchronous Event Emission:** Saves activity to MongoDB and immediately publishes an `Activity` event to RabbitMQ (`fitness.exchange`).

#### 4. AI Recommendation & Coaching Service (`:8083`)
- **Event Consumer:** `@RabbitListener(queues = "activity.queue")` consumes workout events.
- **Gemini AI Integration:** Sends a structured JSON prompt to Google Gemini LLM to generate recommendations.
- **Smart Fallback Engine:** If Gemini experiences rate limits or timeouts, a rule-based algorithm (`createDefaultRecommendation`) computes physiological pacing and safety tips to ensure zero downtime.
- **FitBot AI Coach:** Interactive chatbot service supporting English and Hinglish with clickable quick-reply chips.
- **In-App Notifications:** Emits in-app notification records linking back to the generated activity recommendation.

---

### STEP 4: Real-World Request Flow (Log Workout)

```
[React 19 UI]
     │
     │ 1. POST /api/activities with Keycloak Bearer JWT
     ▼
[Spring Cloud API Gateway :8085]
     │
     │ 2. Validates JWT signature against Keycloak JWKS certs
     │ 3. Resolves lb://ACTIVITY-SERVICE via Netflix Eureka
     ▼
[Activity Service :8082]
     │
     │ 4. Synchronous call via WebClient to UserService (:8081) to validate user
     │ 5. Inserts Activity Document into MongoDB
     │ 6. Publishes Activity Event to RabbitMQ (fitness.exchange -> activity.queue)
     │ 7. Returns HTTP 201 Created to React UI (<40ms!)
     ▼
[RabbitMQ Message Broker]
     │
     │ 8. Buffers and routes event to activity.queue
     ▼
[AI Service :8083]
     │
     │ 9. @RabbitListener consumes event
     │ 10. Calls Google Gemini API with athletic telemetry prompt
     │ 11. Stores Recommendation in MongoDB & dispatches In-App Notification
     ▼
[User UI / Dashboard]
     │
     │ 12. Notification badge alerts user: "Coaching feedback ready!"
```

---

### STEP 5: Key Architectural Decisions

#### Why RabbitMQ instead of Direct REST / OpenFeign?
- **Latency Isolation:** Gemini LLM calls take 2 to 4 seconds. Calling AI synchronously would exhaust thread pools and block UI response.
- **Fault Tolerance:** If Gemini or AI service is restarting, messages remain safe in RabbitMQ.
- **Decoupled Architecture:** Activity service has zero dependency on AI service logic.

#### Why Polyglot Persistence (PostgreSQL + MongoDB)?
- **PostgreSQL in User Service:** User accounts, authentication IDs, and streak tracking require strict ACID transactions, foreign keys, and relational consistency.
- **MongoDB in Activity & AI Services:** Workout telemetry has dynamic attributes (running has pace/cadence; cycling has RPM; weightlifting has sets/reps). AI recommendations and chat transcripts consist of nested JSON structures best handled by a document database.

#### Why Keycloak with OAuth2 + PKCE?
- React is a Single Page Application (SPA) running in a public browser environment; it cannot securely hold a client secret.
- PKCE (Proof Key for Code Exchange) protects authorization codes from interception attacks.

#### Why WebClient instead of RestTemplate?
- `RestTemplate` is blocking and in maintenance mode. `WebClient` is modern, non-blocking, and reactive, ensuring low resource utilization under load.

---

### STEP 6: Top 10 Technical Interview Questions & Answers

#### Q1: How do services discover each other dynamically?
> **Answer:** "We use Netflix Eureka. Each microservice registers its IP, port, and health status upon boot. When the API Gateway routes a request using `lb://SERVICE-NAME`, Spring Cloud Gateway resolves the host and balances requests across available healthy instances."

#### Q2: What happens if the Gemini AI API fails or reaches rate limits?
> **Answer:** "We built a smart fallback mechanism in `ActivityAIService` and `BotChatService`. If the API call fails or times out, the exception is caught, and rule-based algorithms (`createDefaultRecommendation`) compute calorie expenditure ratios and return certified sports-science recovery guidelines without breaking the user experience."

#### Q3: How do you manage configurations across environments?
> **Answer:** "We use Spring Cloud Config Server on port `8888`. All service configurations (`activity-service.yml`, `ai-service.yml`, etc.) are centralized. Services read configurations during startup, enabling seamless transitions between Docker, local, and production environments."

#### Q4: How does FitBot support Hinglish and English?
> **Answer:** "In `BotChatService`, we engineered prompt instructions for Google Gemini to detect Hinglish keywords (e.g., *'bhai'*, *'diet'*, *'kaise'*). When detected, Gemini responds in warm, motivational gym-trainer Hinglish with emoji bullet points and 2-3 clickable quick-reply chips."

#### Q5: How is security handled across downstream microservices?
> **Answer:** "The API Gateway acts as an OAuth2 Resource Server, validating Keycloak JWT signatures once at the network edge. Downstream requests carry the validated authorization header, and user IDs are extracted from token claims (`sub`), ensuring multi-tenant isolation."

#### Q6: How does the streak algorithm work?
> **Answer:** "When a user logs a daily check-in (hydration, sleep, active minutes), `DailyProgressService` compares the current check-in date with the previous record. If consecutive with yesterday, the streak increments; if more than one day was missed, it resets to 1."

#### Q7: What happens if RabbitMQ is temporarily down?
> **Answer:** "The workout activity is already safely committed to MongoDB. In an enterprise production extension, we would implement the **Transactional Outbox Pattern** to store the event in a database table in the same transaction and replay it once the broker is back online."

#### Q8: How is CORS handled?
> **Answer:** "Centrally at the Spring Cloud API Gateway. Because all frontend requests pass through port 8085, downstream microservices do not require redundant CORS filters."

#### Q9: How is the project containerized?
> **Answer:** "Every microservice contains a multi-stage `Dockerfile` based on Eclipse Temurin JDK 17. All containers (Keycloak, RabbitMQ, MongoDB, Eureka, Config Server, Gateway, 3 Business Services, and React Nginx) are orchestrated via `docker-compose.prod.yml` on a bridge network."

#### Q10: What would you add for production scaling?
> **Answer:** "1. Distributed tracing with Micrometer and Zipkin/Jaeger. 2. Circuit breakers via Resilience4j on WebClient calls. 3. Redis caching for user profiles and streak queries."

---

## 📥 Downloadable Resources

All interview prep materials are available in the [`interview-guide/`](./interview-guide) folder:

- 📄 **[Download Interview PDF Guide](./interview-guide/Fitness_App_Microservices_Interview_Guide.pdf)** — Ready-to-print comprehensive 1.1MB PDF.
- 🌐 **[View HTML Guide](./interview-guide/INTERVIEW_PROJECT_GUIDE.html)** — Formatted with print styles and interactive card UI.
- 📝 **[Markdown Notes](./interview-guide/INTERVIEW_PROJECT_GUIDE.md)** — Offline readable markdown file.

---

## 👨‍💻 Author
- **GitHub:** [@2690806kundansingh](https://github.com/2690806kundansingh)
