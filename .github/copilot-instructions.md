# Copilot instructions for Reactivities V4

Quick, focused guidance so an AI coding agent can be productive immediately in this repo.

## Quick summary
- Multi-project .NET + React app. Backend: `API/` (ASP.NET Core, MediatR, EF Core + SQLite). Business logic: `Application/` (CQRS: `Commands`/`Queries`). Persistence: `Persistence/` (EF `AppDbContext`, migrations in `Persistence/Migrations`). Domain models live in `Domain/`.
- Frontend: `client/` (React + TypeScript + Vite, MUI, react-query). API calls use an `agent` wrapper (see `client/src/lib/types/api/agent.ts`).

## Run & dev workflow (most common tasks)
- Start backend:
  - `cd API` then `dotnet run` (Program.cs auto-applies migrations and seeds DB). The SQLite DB file `reactivities.db` is created in the API folder (connection string in `API/appsettings.Development.json`).
- Start frontend:
  - `cd client`, `npm install` (or `pnpm install`), then `npm run dev`. Vite server is already configured to run on port `3000` (`client/vite.config.ts`).
- Environment: set `VITE_API_URL` for the client to point to the API base (example: `VITE_API_URL=https://localhost:5001/api`). The client `agent` expects the base URL; it sends requests like `GET /activities` so base should include `/api` if desired.
- Reset DB: delete `API/reactivities.db` and restart backend to recreate and reseed.

## Architecture & common code patterns
- Controllers: `API/Controllers/*` are thin; they build MediatR requests and call `Mediator.Send(...)`. The base controller is `API/Controllers/BaseAPIController.cs` which provides a `Mediator` property via the request services.
- Application layer: uses a CQRS style. Handlers are nested classes following `public class Query/Command { }` and `public class Handler(AppDbContext context) : IRequestHandler<...>` (C# primary-constructor syntax). Examples: `Application/Activities/Queries/GetActivityList.cs`, `Application/Activities/Commands/CreateActivity.cs`.
- Mapping: AutoMapper profiles live in `Application/Core/MappingProfiles.cs`.
- Persistence: `Persistence/AppDbContext.cs` uses EF Core and the project contains migrations under `Persistence/Migrations/`.
- Domain: POCOs with C# 11 features (e.g., `required` props) live in `Domain/` (see `Domain/Activity.cs`).

## Frontend specifics
- Vite config forces dev server to port `3000` for CORS compatibility with the API (`client/vite.config.ts`).
- React Query is used for server state; see `client/src/lib/types/hooks/useActivities.ts` for the pattern: an `agent` wrapper (`client/src/lib/types/api/agent.ts`) creates an `axios` instance with `VITE_API_URL` and an interceptor that intentionally delays responses (simulated latency).
- UI library: MUI (see `client/package.json`). Routing is handled by `client/src/app/router/Routes.tsx` and bootstrapped in `client/src/main.tsx`.

## Integration points & important invariants
- CORS: `API/Program.cs` allows `http://localhost:3000` and `https://localhost:3000` — keep the frontend on port `3000` (Vite is configured accordingly).
- DB migrations: `Program.cs` runs `context.Database.MigrateAsync()` on startup and calls `DbInitializer.SeeData(context)` to seed sample activities.
- API surface: controllers expose REST-like endpoints under `/api/activities` mapped to MediatR handlers. Client code hits these endpoints via the `agent` base URL.

## Editing patterns an AI should follow
- When adding server-side features, add a `Query`/`Command` class in `Application/Activities/*` and the corresponding `Handler` that uses `AppDbContext`. Keep controllers thin.
- Use `AutoMapper` profiles in `Application/Core/MappingProfiles.cs` for DTO <-> Domain mappings when needed.
- For frontend changes, prefer hooks under `client/src/lib/types/hooks` and central `agent` for HTTP calls so interceptors/headers remain consistent.

## Examples (where to look)
- Endpoint implementation example: `API/Controllers/ActivitiesController.cs` -> sends `GetActivityList.Query`.
- Query example: `Application/Activities/Queries/GetActivityList.cs`.
- Create command: `Application/Activities/Commands/CreateActivity.cs`.
- React hook calling API: `client/src/lib/types/hooks/useActivities.ts` and `client/src/lib/types/api/agent.ts`.

## Useful commands
- Backend: `cd API` then `dotnet run` (applies migrations + seeds).
- Frontend: `cd client` then `npm run dev` (Vite), `npm run build` to build.
- To add migrations: run EF commands from the solution or project root; migrations are kept in `Persistence/`.

## Where to look next
- If behavior is unexpected, inspect `API/Program.cs` (startup), `Persistence/DbInitializer.cs` (seeding), and `client/src/lib/types/api/agent.ts` (client base URL and interceptors).

If anything here is unclear or you'd like more detail on any section (for example: exact EF commands to add a migration, or preferred commit message style), tell me which part to expand and I'll iterate.
