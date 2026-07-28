# ToDoList with Weather Forecast

A full-stack to-do list application with a live weather panel. React + TypeScript on the front end, Spring Boot on the back end, with manually reorderable tasks persisted in H2 during development and PostgreSQL in production.

## Features

- Create, edit, complete, and delete tasks
- Manual reordering with move up / move down — order is persisted server-side and survives a refresh
- Current weather for Sofia from the Open-Meteo API, refreshed periodically
- Responsive layout that adapts smoothly between desktop and mobile

## Layout

The three panels are laid out with Bootstrap's grid — weather, task list, task input side by side on desktop, stacked into a single column on mobile, with the task list scrolling internally in both cases. The result reads well on a wide screen and on a phone without any separate mobile version.

## Tech stack

**Frontend** — React, TypeScript, Vite, Bootstrap 5, axios, openmeteo

**Backend** — Java 25, Spring Boot 4.1, Spring Data JPA, Hibernate, MapStruct, Lombok, Maven

**Data** — H2 (file-based) in development, PostgreSQL 18 in production

**Infrastructure** — Docker, Docker Compose, nginx

**Testing** — JUnit 5, Mockito, Spring Boot Test

## Project structure

```
ToDoListWithWeatherForecast/
├── docker-compose.yml        Postgres, backend, and frontend together
├── frontend/                 Vite + React + TypeScript client
│   ├── Dockerfile            Builds the app, serves it with nginx
│   ├── nginx.conf
│   └── src/
│       ├── components/
│       │   ├── task-input/
│       │   ├── task-list/
│       │   └── weather-forecast/
│       └── types.ts
└── backend/todolist/         Spring Boot REST API
    ├── Dockerfile            Multi-stage build with layered extraction
    └── src/main/java/bg/sofia/elando/todolist/
        ├── controller/       REST endpoints
        ├── service/          business logic
        ├── repository/       Spring Data JPA
        ├── entity/           JPA persistence model
        ├── model/            domain model
        ├── dto/              request/response objects
        ├── mapper/           MapStruct converters
        └── exception/        custom exceptions and global handler
```

The backend keeps persistence, domain, and API models as separate types, with MapStruct generating the conversions between them at compile time.

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | All tasks, newest first |
| `GET` | `/tasks/{id}` | A single task |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/{id}` | Update the text or completed state |
| `PATCH` | `/tasks/{id}/move-up` | Move a task up, returns the reordered list |
| `PATCH` | `/tasks/{id}/move-down` | Move a task down, returns the reordered list |
| `DELETE` | `/tasks/{id}` | Delete a task |

`PATCH /tasks/{id}` accepts either field independently — omitted fields are left unchanged.

Requests for an id that does not exist return 404 with a consistent error body, handled centrally by a `@RestControllerAdvice` rather than in each controller method.

### Ordering

Each task carries a position assigned by a database sequence on insert, and the list is returned in descending order so new tasks appear at the top. Move up/down swaps the positions of two adjacent rows inside a transaction. Position is never exposed through the API — the client simply renders the list in the order it receives.

## Configuration

Datasource settings are split across Spring profiles. `application.properties` holds everything both environments share, and the active profile layers its own datasource on top.

- **dev** (default) — file-based H2 in `backend/todolist/data/`, with the H2 console enabled at `/h2-console`. H2 runs in PostgreSQL compatibility mode so the same entity mapping works against both databases.
- **prod** — PostgreSQL, with the URL and credentials supplied as environment variables rather than committed to the repository.

Docker Compose activates the prod profile by setting `SPRING_PROFILES_ACTIVE`, so the same image runs in either environment with only configuration changing.

## Testing

```bash
cd backend/todolist
./mvnw test
```

Three layers, each isolated from the ones below it:

- **Controller** — `@WebMvcTest` with a mocked service, asserting status codes, JSON shape, and that the ordering returned by the service reaches the client intact
- **Service** — plain JUnit with Mockito, covering the reorder logic, partial updates, and the not-found paths
- **Repository** — `@DataJpaTest` against a real in-memory database, verifying the hand-written JPQL for ordering and adjacent-row lookups

## Weather

Weather data comes from [Open-Meteo](https://open-meteo.com/), a free forecast API that requires no API key or registration. The frontend uses the official `openmeteo` client package to fetch the current temperature, humidity, wind speed, weather code, and the daily high and low for Sofia's coordinates.

The request runs once when the component mounts and then every 15 minutes on an interval, cleaned up when the component unmounts. That matches Open-Meteo's own refresh cadence, so the panel stays in step with the source data without polling more often than there is anything new to fetch.

## Running with Docker

The whole stack — database, backend, and frontend — starts with one command from the repository root:

```bash
docker compose up --build
```

The app is then available at `http://localhost:3000`. nginx serves the built frontend and proxies `/tasks` to the backend, so no CORS configuration is needed. Task data persists in a named volume across restarts; `docker compose down -v` clears it.

Both images are multi-stage: the backend compiles with a JDK and ships only a JRE and the extracted application layers, and the frontend builds with Node and ships only static files behind nginx. Neither runs as root.

## Running locally

For development, both halves run directly on the host.

**Backend** (port 8080):

```bash
cd backend/todolist
./mvnw spring-boot:run
```

**Frontend** (port assigned automatically, starting from 5173):

```bash
cd frontend
npm install
npm run dev
```

Requests to `/tasks` are forwarded to the backend by the Vite dev proxy, mirroring what nginx does in production.

## Possible improvements

- Flyway migrations instead of `ddl-auto`, so schema changes are versioned and reviewable
- Testcontainers so the test suite runs against the same database as production
- Bean validation on request DTOs
- Geolocation instead of hardcoded coordinates
- Weather condition icons mapped from WMO codes
- Optimistic UI updates with rollback on failure
