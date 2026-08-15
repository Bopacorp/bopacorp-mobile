# Bopacorp CRM Mobile — Software Architecture Notes

This document describes the architectural design patterns, component modularity, and SOLID design principles implemented in the **Bopacorp Mobile** application.

---

## 1. Architectural Overview

The application utilizes the **Model-View-ViewModel (MVVM)** design pattern, optimized for React Native and Expo Router. 

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│    View (UI)    │ ───>  │  Hooks & state  │ ───>  │  Service Facade  │
│  (React Screen) │       │ (React context) │       │ (ClientServices) │
└─────────────────┘       └─────────────────┘       └──────────────────┘
                                                            │ (Axios)
                                                            ▼
                                                    ┌──────────────────┐
                                                    │   Bopacorp API   │
                                                    └──────────────────┘
```

*   **View Layer (`app/` and `components/`)**: Handles UI rendering, user input, and screen navigation.
*   **State & Controller Layer (`context/`)**: Orchestrates globally shared state (e.g., advisor sessions, caching) and manages business logic.
*   **Service Layer (`services/`)**: Encapsulates raw REST API communications, request-response mappings, and caching strategies.

---

## 2. Design Patterns Implemented

The mobile client leverages several software engineering design patterns:

### 2.1. Service Layer Pattern
All REST API transactions are isolated within [`services/ClientServices.ts`](file:///Users/lolothens/Code/Bopacorp/bopacorp-mobile/services/ClientServices.ts). React screens never perform direct network calls (e.g., via `fetch` or `axios`). Instead, they invoke descriptive functions:
```typescript
// Isolates API communication details from components
export const createVisit = async (data: CreateVisitRequest): Promise<VisitResponse> => { ... };
```

### 2.2. Facade Pattern
The network client [`services/api.ts`](file:///Users/lolothens/Code/Bopacorp/bopacorp-mobile/services/api.ts) acts as a **Facade** over Axios:
*   It exposes a simple client configuration (`apiClient`).
*   It hides the complex HTTP interceptor pipelines, custom header injections, and error-unwrapping logic from the rest of the application.

### 2.3. Interceptor / Decorator Pattern
Axios interceptors dynamically decorate outgoing HTTP requests with the authorization headers:
*   **Request Interceptor**: Injects the short-lived JWT access token in memory (`Authorization: Bearer <token>`).
*   **Response Interceptor**: Intercepts `401 Unauthorized` responses and performs a **Silent Token Refresh** via `/auth/refresh` using `SecureStore`. If successful, it automatically retries the original request without user interruption.

### 2.4. Observer & Context Patterns
The [`context/AuthContext.tsx`](file:///Users/lolothens/Code/Bopacorp/bopacorp-mobile/context/AuthContext.tsx) acts as a central **Observer** of the advisor's authentication session:
*   It provides reactive states (`role`, `user`, `isLoading`) that components subscribe to via `useAuth()`.
*   Views re-render dynamically as authentication states change.

---

## 3. SOLID Compliance

The codebase adheres strictly to SOLID principles:

### 3.1. Single Responsibility Principle (SRP)
Each component and file does one job and has one reason to change:
*   `ClientServices.ts` is solely responsible for outgoing request formatting and network interaction.
*   `AuthContext.tsx` is solely responsible for managing token storage and session state.
*   UI Views (e.g., `CreateClientScreen`) are solely responsible for form data capturing and presentation.

### 3.2. Open-Closed Principle (OCP)
The system is open for extension but closed for modification through the contract models defined in the shared library `@bopacorp/shared`:
*   New schemas, query properties, or entities are added to the shared package without modifying the mobile app's underlying core HTTP parser or network configurations.

### 3.3. Interface Segregation Principle (ISP)
TypeScript interfaces are designed to be slim and specific:
*   Instead of exposing database-level rows (with columns like `passwordHash`, `deletedAt`), interfaces inside the mobile client use segregated contract structures (e.g., `BusinessClient`, `Negotiation`) that only expose fields the mobile application consumes.

### 3.4. Dependency Inversion Principle (DIP)
High-level views do not depend on low-level database configurations or concrete networking libraries. Instead, they depend on abstract TypeScript interfaces and schemas.
