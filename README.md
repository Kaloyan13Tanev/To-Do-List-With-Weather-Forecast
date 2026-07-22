# ToDoList with Weather Forecast

A full-stack to-do list application with a live weather panel. React + TypeScript on the front end, Spring Boot on the back end, with tasks persisted in H2 and manually reorderable.

## Features

- Create, edit, complete, and delete tasks
- Manual reordering with move up / move down — order is persisted server-side and survives a refresh
- Current weather for Sofia from the Open-Meteo API, refreshed periodically
- Responsive layout that adapts smoothly between desktop and mobile

## Layout

The three panels are laid out with Bootstrap's grid — weather, task list, task input side by side on desktop, stacked into a single column on mobile, with the task list scrolling internally in both cases. The result reads well on a wide screen and on a phone without any separate mobile version.

## Tech stack

**Frontend** — React, TypeScript, Vite, Bootstrap 5, axios, openmeteo

**Backend** — Java 25, Spring Boot 4.1, Spring Data JPA, Hibernate, H2 (file-based), MapStruct, Lombok, Maven

## Project structure

```
ToDoListWithWeatherForecast/
├── frontend/                 Vite + React + TypeScript client
│   └── src/
│       ├── components/
│       │   ├── task-input/
│       │   ├── task-list/
│       │   └── weather-forecast/
│       └── types.ts
└── backend/todolist/         Spring Boot REST API
    └── src/main/java/bg/sofia/elando/todolist/
        ├── controller/       REST endpoints
        ├── service/          business logic
        ├── repository/       Spring Data JPA
        ├── entity/           JPA persistence model
        ├── model/            domain model
        ├── dto/              request/response objects
        └── mapper/           MapStruct converters
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

### Ordering

Each task carries a position assigned by a database sequence on insert, and the list is returned in descending order so new tasks appear at the top. Move up/down swaps the positions of two adjacent rows inside a transaction. Position is never exposed through the API — the client simply renders the list in the order it receives.

## Weather

Weather data comes from [Open-Meteo](https://open-meteo.com/), a free forecast API that requires no API key or registration. The frontend uses the official `openmeteo` client package to fetch the current temperature, humidity, wind speed, weather code, and the daily high and low for Sofia's coordinates.

The request runs once when the component mounts and then every 15 minutes on an interval, cleaned up when the component unmounts. That matches Open-Meteo's own refresh cadence, so the panel stays in step with the source data without polling more often than there is anything new to fetch.

## Running locally

Both halves run independently.

**Backend** (port 8080):

```bash
cd backend/todolist
./mvnw spring-boot:run
```

The H2 console is available at `/h2-console`, and the database file lives in `backend/todolist/data/`.

**Frontend** (port assigned automatically, starting from 5173):

```bash
cd frontend
npm install
npm run dev
```

Requests to `/tasks` are forwarded to the backend by the Vite dev proxy, so no CORS configuration is needed in development.

## Possible improvements

- Global exception handling so unknown ids return 404 with a consistent error body
- Bean validation on request DTOs
- Unit and integration tests for the service and controller layers
- Geolocation instead of hardcoded coordinates
- Weather condition icons mapped from WMO codes
- Optimistic UI updates with rollback on failure
