# 🚀 AI-Powered Fitness & Wellness Microservices Platform
## Complete Step-by-Step Technical Interview Master Guide

---

## 📌 TABLE OF CONTENTS
1. [STEP 1: The 60-Second Elevator Pitch (Start with this)](#step-1-the-60-second-elevator-pitch)
2. [STEP 2: Project Objectives & Business Problem](#step-2-project-objectives--business-problem)
3. [STEP 3: Complete Tech Stack Breakdown & Justifications](#step-3-complete-tech-stack-breakdown)
4. [STEP 4: Microservices Architecture & Ecosystem](#step-4-microservices-architecture--ecosystem)
5. [STEP 5: Core Functionalities & Modules](#step-5-core-functionalities--modules)
6. [STEP 6: Real-World Request Flow (End-to-End Walkthrough)](#step-6-real-world-request-flow)
7. [STEP 7: Key Architectural Decisions (Why this tech?)](#step-7-key-architectural-decisions)
8. [STEP 8: Top 10 Technical Interview Questions & Smart Answers](#step-8-top-10-technical-interview-questions--smart-answers)
9. [STEP 9: How to Structure Your Answers in an Interview](#step-9-how-to-structure-your-answers)

---

<a name="step-1-the-60-second-elevator-pitch"></a>
## 🎯 STEP 1: The 60-Second Elevator Pitch (Start With This)

> **Interviewer Question:** *"Can you please introduce yourself and tell me about your latest project?"*

### 🗣️ Exact Interview Script:
> "I recently built an enterprise-grade, event-driven **AI-Powered Fitness & Wellness Microservices Application** using **Java 17, Spring Boot 3, Spring Cloud, RabbitMQ, Keycloak OAuth2, and React 19**.
> 
> The core objective of the platform is to provide **automated, real-time personalized athletic coaching**. When athletes log activities like running, cycling, or strength training, the system asynchronously streams telemetry through **RabbitMQ** to an **AI Recommendation Service** integrated with **Google Gemini Generative AI**. The AI analyzes heart rate, pacing, and caloric expenditure to return customized recovery tips, pace progressions, and safety warnings.
> 
> The application uses an **API Gateway with Eureka Service Discovery**, **Spring Cloud Config Server**, and **Polyglot Persistence**—using PostgreSQL for transactional user profiles and MongoDB for flexible telemetry data and AI chat interactions. It is fully containerized with Docker and secured with Keycloak using the OAuth 2.0 PKCE flow."

---

<a name="step-2-project-objectives--business-problem"></a>
## 💡 STEP 2: Project Objectives & Business Problem

### Problem Solved:
1. **Lack of Instant Coaching:** Traditional fitness applications only store numbers (distance, duration, calories) without explaining *what those numbers mean* or *how to recover*.
2. **Blocking UI Latency:** Monolithic apps that invoke LLMs synchronously hang user requests for 2–5 seconds, degrading user experience.
3. **High Security Requirements:** Protecting user health metrics and identity with industry-standard SSO rather than plain DB credentials.

### Key Objectives:
- **Real-Time Telemetry Tracking:** Log cardiovascular and strength workouts with dynamic metrics.
- **Decoupled Asynchronous AI Insights:** Use Event-Driven Architecture (EDA) so user workout logging is instantaneous (<40ms), while AI compute runs in the background.
- **Interactive AI Coach (FitBot):** A 24/7 conversational mentor supporting both English and Hinglish gym queries with structured advice and quick-reply action chips.
- **Habit Formation:** Track daily streaks, hydration, and sleep check-ins to boost user retention.

---

<a name="step-3-complete-tech-stack-breakdown"></a>
## 🛠️ STEP 3: Complete Tech Stack Breakdown

| Layer | Technology | Version | Why We Chose It |
|---|---|---|---|
| **Backend Framework** | Java, Spring Boot | Java 17, Spring Boot 3.4.3 | High throughput, mature enterprise ecosystem, Spring 6 virtual thread & reactive support. |
| **API Gateway** | Spring Cloud Gateway | Spring Cloud 2024.0.0 | Single entry point, centralized JWT token validation, non-blocking Netty routing. |
| **Service Discovery** | Netflix Eureka Server | Spring Cloud Eureka | Client-side load balancing, dynamic service registration, zero hardcoded IP addresses. |
| **Distributed Config** | Spring Cloud Config | Spring Cloud Config | Centralized configuration repository for dev, docker, and prod profiles. |
| **Message Broker** | RabbitMQ | 3.x (AMQP Protocol) | Reliable event-driven decoupling between Activity logging and heavy AI processing. |
| **AI / LLM Engine** | Google Gemini API | `gemini-1.5-flash` / Generative Language API | Advanced natural language reasoning, sports science insights, structured JSON schema response. |
| **Security / IAM** | Keycloak | 24.0.1 (OAuth2.0 / OIDC) | Centralized authentication, JWT issuing, PKCE flow for Single Page Applications (SPAs). |
| **Databases** | PostgreSQL & MongoDB | Relational & NoSQL (Mongo 6) | Polyglot persistence: PostgreSQL for ACID user records; MongoDB for unstructured workouts & AI prompts. |
| **Service-to-Service HTTP** | Spring WebClient | WebFlux 3.4.3 | Modern, non-blocking asynchronous HTTP client for synchronous user existence validation. |
| **Frontend Framework** | React, Vite, Redux Toolkit, MUI | React 19, Vite 6 | Lightning-fast HMR, state-managed single-page application, responsive Material UI components. |
| **DevOps / Containerization** | Docker, Docker Compose, Nginx | Multi-stage Docker | Containerized microservice deployment with health checks and bridge networking. |

---

<a name="step-4-microservices-architecture--ecosystem"></a>
## 🏗️ STEP 4: Microservices Architecture & Ecosystem

```
               +--------------------------------------------------------+
               |                  React 19 + Vite Frontend              |
               |       (OAuth 2.0 PKCE Flow via Keycloak Identity)      |
               +---------------------------+----------------------------+
                                           |
                                [HTTPS / JSON Requests]
                                           |
                                           v
               +--------------------------------------------------------+
               |            Spring Cloud API Gateway (Port 8085)        |
               |  - Validates Keycloak JWT against JWKS Public Keys     |
               |  - Dynamic Route Resolution via Eureka Registry        |
               +---------------------------+----------------------------+
                                           |
         +---------------------------------+---------------------------------+
         |                                 |                                 |
         v                                 v                                 v
+------------------+             +--------------------+            +--------------------+
|   USER-SERVICE   |             |  ACTIVITY-SERVICE  |            |     AI-SERVICE     |
|   (Port 8081)    |             |    (Port 8082)     |            |    (Port 8083)     |
| - Profiles       |             | - Workout Logging  |            | - Event Consumer   |
| - Daily Progress |<--(WebClient| - Sync User Check  |            | - Gemini API Client|
| - Daily Streaks  |    Validate)|                    |            | - FitBot Chatbot   |
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
1. **Eureka Server (Port 8761):** All microservices register as eureka clients upon boot.
2. **Config Server (Port 8888):** Supplies externalized `activity-service.yml`, `ai-service.yml`, `user-service.yml`, and `api-gateway.yml`.
3. **Keycloak (Port 8181):** Realm `fitness-oauth2` issues signed JWT tokens containing user roles and claims.

---

<a name="step-5-core-functionalities--modules"></a>
## 📱 STEP 5: Core Functionalities & Modules

### 1. User & Habit Management (`userservice`):
- Registration, Profile settings (weight, height, fitness goals).
- **Daily Check-in:** Records sleep hours, water intake, active minutes.
- **Streak Algorithm:** Checks timestamp continuity; increments streak when checked in on consecutive days, or resets on misses.

### 2. Activity & Workout Tracking (`activityservice`):
- Supports workout types: RUNNING, CYCLING, SWIMMING, WEIGHT_TRAINING, HIIT, YOGA, WALKING.
- Captures duration, calories burned, heart rate, distance, and custom key-value metrics.
- Synchronously validates user existence via non-blocking Spring `WebClient`.
- Publishes an `Activity` payload event to RabbitMQ topic exchange `fitness.exchange`.

### 3. AI Insights & Coaching Engine (`aiservice`):
- **Asynchronous Event Listener:** `@RabbitListener(queues = "activity.queue")` receives workout events.
- **Gemini LLM Prompting:** Sends structured JSON schema prompts to Google Gemini API.
- **Coaching Report:** Generates Pace Analysis, Heart Rate Zone assessment, Improvement Areas, Next Workout Recommendations, and Injury Prevention Safety Guidelines.
- **FitBot Conversational Coach:** Dynamic chat service supporting English and Hinglish (e.g., answering *"bhai workout ke baad kya khaye?"* with certified sports nutrition advice).
- **In-App Notification Dispatcher:** Creates in-app notifications whenever background AI coaching reports are ready.

---

<a name="step-6-real-world-request-flow"></a>
## 🔄 STEP 6: Real-World Request Flow (End-to-End)

When asked: *"Walk me through the lifecycle of a request from UI to Database."*

1. **User Action:** The user logs a 30-minute run burning 320 kcal on the React 19 UI.
2. **Frontend Authentication:** The React app attaches the Bearer JWT token from Keycloak to the HTTP request and sends `POST /api/activities`.
3. **API Gateway Interception:**
   - Spring Cloud Gateway intercepts the call at port `8085`.
   - Validates token validity and signature against Keycloak's JWKS endpoint (`/certs`).
   - Looks up `ACTIVITY-SERVICE` in Netflix Eureka and proxies the request to port `8082`.
4. **Synchronous Validation (WebClient):**
   - `ActivityService` calls `UserValidationService`.
   - Uses non-blocking Spring `WebClient` to query `USER-SERVICE` at `GET /api/users/{userId}/validate`.
   - If user is valid, execution continues; otherwise throws `UserNotFoundException`.
5. **Database Persistence & Event Publication:**
   - The activity is saved into MongoDB (`fitnessactivity` database).
   - An `Activity` event is immediately published to RabbitMQ exchange `fitness.exchange` with routing key `activity.tracking`.
   - `ActivityService` returns `201 Created` back to the user's browser in <40ms.
6. **Asynchronous Background AI Processing:**
   - `AIService`'s `@RabbitListener` consumes the activity message from `activity.queue`.
   - Formats a structured prompt containing athletic metrics and calls Google Gemini AI.
   - Parses the JSON response into distinct sections (Overall analysis, Pace, Heart rate, Improvements, Suggestions, Safety).
   - Persists the `Recommendation` entity into MongoDB (`fitnessrecommendation` database).
   - Generates an in-app notification linking to `/activities/{activityId}`.
7. **Client Feedback:** The user receives an in-app notification badge, clicks it, and views their personalized AI coaching analysis.

---

<a name="step-7-key-architectural-decisions"></a>
## 🧠 STEP 7: Key Architectural Decisions (Why This Tech?)

### 1. Why RabbitMQ instead of Direct Synchronous REST calls?
- **User Experience:** Calling Google Gemini LLM takes between 2 to 4 seconds. If done synchronously over HTTP, the user's "Save Workout" button would hang, causing perceived lag.
- **Decoupling & Fault Isolation:** If Google Gemini experiences high latency or downtime, the user's workout is still saved successfully without HTTP 500 errors.
- **Queue Buffering & Retry:** RabbitMQ safely holds messages if the AI service restarts or experiences a traffic spike.

### 2. Why Polyglot Persistence (PostgreSQL vs MongoDB)?
- **PostgreSQL in User Service:** User accounts, credentials, and streak dates require strict ACID transactions, relational integrity, and structured schemas.
- **MongoDB in Activity & AI Services:** Workout metrics vary drastically (e.g. running has GPS/pace; weight training has sets/reps; cycling has RPM). AI coaching outputs contain variable nested JSON trees and dynamic markdown chat history. MongoDB's flexible document model handles these without expensive SQL migrations.

### 3. Why Keycloak with OAuth2 + PKCE?
- **PKCE (Proof Key for Code Exchange):** Single Page Applications (React) run in public browser environments and cannot safely store a client secret. PKCE generates dynamic code verifiers and challenges, preventing authorization code interception attacks.
- **Centralized Security:** Microservices don't maintain local password hashes; they simply validate signed JWT tokens at the gateway.

### 4. Why WebClient instead of RestTemplate?
- `RestTemplate` is blocking and in maintenance mode. Spring's `WebClient` is reactive, non-blocking, and handles concurrent I/O efficiently.

### 5. Smart Resilience & Fallback Strategy:
- In `ActivityAIService` and `BotChatService`, the external Gemini API call is wrapped in defensive try-catch logic. If the API is rate-limited or times out, the system automatically falls back to sports-science rule-based algorithms (`createDefaultRecommendation`). Zero user crashes.

---

<a name="step-8-top-10-technical-interview-questions--smart-answers"></a>
## ❓ STEP 8: Top 10 Technical Interview Questions & Smart Answers

### Q1: How do your microservices communicate with each other?
> **Answer:** "We use both synchronous and asynchronous communication:
> - **Synchronous (WebClient):** Used for read-only validation where the calling service strictly needs an immediate response before proceeding—such as `ActivityService` validating if a user exists via `WebClient` calling `UserService`.
> - **Asynchronous (RabbitMQ):** Used for non-blocking event-driven workloads—such as publishing workout events to `fitness.exchange` so that `AIService` can generate recommendations in the background."

### Q2: What is the role of Spring Cloud API Gateway?
> **Answer:** "The Gateway serves as the single reverse proxy for the entire architecture:
> 1. It acts as an **OAuth2 Resource Server**, validating the incoming JWT token signature against Keycloak's public certs (`JWK Set URI`).
> 2. It manages centralized **CORS configuration**.
> 3. It dynamically routes client requests using Eureka service IDs (`lb://USER-SERVICE`, `lb://ACTIVITY-SERVICE`, `lb://AI-SERVICE`), providing client-side load balancing."

### Q3: What happens if RabbitMQ or the AI Service goes down?
> **Answer:** "Because of asynchronous decoupling, the core user flow is completely unaffected. The user can still register, log in, track daily habits, and log workouts. The workout is saved to MongoDB. Once RabbitMQ or the AI service recovers, the queued messages are consumed and processed. Furthermore, our AI service includes smart fallbacks so if Gemini API limits occur, default recommendations are generated seamlessly."

### Q4: How does Eureka Service Discovery work under the hood?
> **Answer:** "Each microservice includes `spring-cloud-starter-netflix-eureka-client`. When a service starts, it sends a REST heartbeat to Eureka Server on port 8761, registering its host, port, and health status. The API Gateway caches this registry and uses Spring Cloud LoadBalancer to distribute requests across healthy instances."

### Q5: Why did you use Spring Cloud Config Server?
> **Answer:** "To achieve externalized configuration following 12-Factor App principles. Rather than bundling database URLs, RabbitMQ credentials, and ports inside each microservice JAR, the Config Server serves centralized YAML files (`activity-service.yml`, `ai-service.yml`, etc.). We can modify configurations or switch between environments (Dev, Docker, Production) without recompiling application code."

### Q6: How does FitBot handle bilingual queries (Hinglish + English)?
> **Answer:** "In `BotChatService`, we engineered custom system prompts for Google Gemini with language instructions. If the user asks in Hinglish (e.g. *'bhai diet batao workout ke baad'*), Gemini detects the tone and answers in friendly, motivational Hinglish gym lingo with emoji bullet points. If the query is in English, it responds in English, alongside 2-3 clickable quick-reply chips."

### Q7: How do you prevent unauthorized users from tampering with other users' data?
> **Answer:** "Authentication is enforced at the Gateway via Keycloak JWT tokens. In down-level services, the authenticated user's ID (`sub` or custom claim) is extracted from the security context or token header, guaranteeing that database queries filter strictly by `userId == authenticatedUserId`."

### Q8: What database transaction management did you use?
> **Answer:** "In `userservice`, we utilize Spring's `@Transactional` over JPA repositories to ensure atomic operations on user profiles and streak counters. In `activityservice` and `aiservice`, MongoDB handles document-level atomicity, with RabbitMQ ensuring eventual consistency across microservice boundaries."

### Q9: How did you deploy and test this project?
> **Answer:** "The entire stack is containerized using multi-stage Docker builds and orchestrated with `docker-compose.prod.yml`. It spins up Keycloak, RabbitMQ, MongoDB, Eureka, Config Server, Gateway, the 3 business microservices, and an Nginx container serving the React build. For remote external access, we used Cloudflare Tunnel."

### Q10: What would you add to make this system production-ready at large scale?
> **Answer:** "I would implement:
> 1. **Distributed Tracing:** Integrate Micrometer Tracing with Zipkin/Jaeger to track end-to-end request latency across the Gateway and RabbitMQ queues.
> 2. **Circuit Breaker:** Add Resilience4j circuit breakers on synchronous WebClient calls.
> 3. **Redis Caching:** Cache frequently queried user profiles and recommendation summaries to reduce database load.
> 4. **Dead Letter Queue (DLQ):** Configure DLQ in RabbitMQ for failed messages after 3 retry attempts."

---

<a name="step-9-how-to-structure-your-answers"></a>
## ⭐ STEP 9: How to Structure Your Answers in an Interview

Follow the **STAR** technique:
- **Situation:** "In our fitness application, we needed to generate AI athletic coaching without slowing down workout logging."
- **Task:** "I needed to design an architecture where LLM processing wouldn't block user HTTP requests or create thread pool exhaustion."
- **Action:** "I introduced RabbitMQ as an asynchronous message broker, built an AI Service with Google Gemini and smart fallback logic, and secured the gateway with Keycloak OAuth2 PKCE."
- **Result:** "Our workout logging response time dropped to under 40 milliseconds, while users received comprehensive AI coaching recommendations in the background without UI lag."

---
*Created for interview preparation. PDF and printable HTML versions are available in the project root.*
