# Bopacorp CRM — Mobile Advisor Application Implementation Plan

This document outlines the strategic roadmap for extending the Bopacorp CRM to mobile iOS and Android platforms. The app is built **exclusively for Sales Advisors (Asesores)** to log visits, manage deals, register corporate clients, and upload external candidate resumes in the field.

---

## 1. Technology Stack & Development Environment

### Framework & Tooling
* **Core Framework:** React Native with **Expo**. Expo provides a unified development experience and handles the heavy lifting of native builds.
* **Routing:** **Expo Router** (file-based routing).
* **Version Control:** GitHub.

### Local Development (Mac Optimization)
* **Simulator:** Run the native iOS Simulator or Android Emulator directly alongside VS Code. Expo CLI auto-detects the simulator and hot-reloads changes.
* **Editor:** VS Code with recommended extensions:
    * *ESLint* and *Prettier* for formatting.
    * *Expo Tools* for deep integration.

---

## 2. Core Architecture Integration

The mobile app adheres to the backend's strict API conventions and shared validation logic.

### 2.1 Shared Schemas (`@bopacorp/shared`)
To maintain a single source of truth for advisor models:
* Configure the React Native project to consume the existing `@bopacorp/shared` package. 
* This ensures all Zod schemas (`ApiSuccessSchema`, `ApiErrorSchema`, etc.) are identical across the API, web frontend, and mobile app.

### 2.2 Global Data Fetching
* **Library:** **TanStack Query (React Query)**.
* **Purpose:** Handles caching, background syncing, and pagination.
* **Wrapper:** Build a custom API client (using Axios) that automatically unwraps the standard Bopacorp `{ success: true, data: {...} }` envelope, feeding the clean data into React Query hooks.

### 2.3 Global Error Handling
The backend relies on strict HTTP codes (`400`, `401`, `404`, `422`) and error payloads (`{ success: false, error: { code, message } }`).
* Implement a global response interceptor in Axios.
* Map specific codes (like `VALIDATION_ERROR`) to native mobile UI feedback, such as inline form errors or toasts.

---

## 3. Authentication Flow (The Token Pair System)

The backend utilizes a fast, stateless Access Token (1d JWT) and a revocable Refresh Token (30d opaque string) stored in the database.

### 3.1 Token Storage Strategy
* **Refresh Token:** Stored securely using `expo-secure-store` (encrypted on the device).
* **Access Token:** Kept in-memory (React Context) to prevent extraction attacks and optimize speed.

### 3.2 Silent Refresh & Redirection
Implement an Axios interceptor to handle rotation transparently:
1.  App makes a request. Backend returns `401 UNAUTHORIZED`.
2.  Interceptor pauses all outgoing requests.
3.  Interceptor reads the Refresh Token from `expo-secure-store`.
4.  App calls `POST /api/v1/auth/refresh`.
5.  If successful, the app saves the new token pair, resumes paused requests, and retries the original failed request.
6.  If failed (e.g., token expired or rotated), clear local state and force redirect the Sales Advisor to the Login screen.
7.  **Single Role Focus:** The app is configured strictly for the `advisor` (Asesor) role. Success login immediately redirects to the Advisor Dashboard (`/(tabs)`). There are no supervisor switches or administrative dashboards.

---

## 4. Feature Implementation: Employability Module

The employability module features a public job application endpoint (`POST /api/v1/employability/apply`) that accepts `multipart/form-data` uploads.

### File Uploads on Mobile
* **File Selection:** Use `expo-document-picker` to open the native iOS/Android file browsers to pick a PDF resume.
* **Payload Construction:**
    ```javascript
    // Example logic for appending the mobile file to FormData
    const formData = new FormData();
    formData.append('file', {
      uri: document.uri, // The local file URI provided by Expo
      name: document.name,
      type: 'application/pdf'
    });
    // Append candidate metadata as a JSON string
    formData.append('candidate', JSON.stringify({
      nationalId: '...',
      firstName: '...',
      lastName: '...',
      email: '...',
      phone: '...'
    }));
    ```

---

## 5. Phased Execution Plan

| Phase | Milestone | Focus Areas |
| :--- | :--- | :--- |
| **Phase 1** | **Setup & Foundation** | Initialize Expo, configure TS path aliases, and configure local network endpoints in `.env` for device testing. |
| **Phase 2** | **Networking & Shared Types** | Link `@bopacorp/shared`, configure Axios custom wrapper (`services/api.ts`), and unwrap Bopacorp envelopes. |
| **Phase 3** | **Authentication System** | Build the Login UI, implement secure keychain token storage, and write the silent refresh interceptor for Sales Advisor sessions. |
| **Phase 4** | **Core Advisor Modules & UI** | Build mobile screens for Advisor entities (Client List, Visited Log, catalog, Deals) using Expo Router and React Query. |
| **Phase 5** | **File Handling (Employability)** | Implement the `expo-document-picker` flow and connect multipart PDF uploads to `/api/v1/employability/apply`. |
| **Phase 6** | **Polish & Testing** | Finalize styling, run device tests using Expo Go, and prepare for iOS/Android builds. |
