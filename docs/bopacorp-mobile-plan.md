# Bopacorp CRM — Mobile Application Implementation Plan

This document outlines the strategic roadmap for extending the Bopacorp CRM to mobile iOS and Android platforms. The app will be built to integrate seamlessly with the existing React web frontend and the structured PostgreSQL backend.

---

## 1. Technology Stack & Development Environment

### Framework & Tooling
* **Core Framework:** React Native with **Expo**. Expo provides a unified development experience and handles the heavy lifting of native builds.
* **Routing:** **Expo Router** (file-based routing similar to Next.js).
* **Version Control:** GitHub. Create a new repository (e.g., `bopacorp-mobile`) or add a new mobile package to your existing monorepo.

### Local Development (M1 Mac Optimization)
The Apple Silicon architecture provides exceptional performance for mobile development.
* **Simulator:** Run the native iOS Simulator directly alongside VS Code. Expo CLI will auto-detect the simulator and hot-reload changes instantly.
* **Editor:** VS Code with the following extensions recommended for this stack:
    * *ESLint* and *Prettier* for code formatting.
    * *Expo Tools* for deep integration.

---

## 2. Core Architecture Integration

The mobile app must adhere to the backend's strict API conventions and shared validation logic.

### 2.1 Shared Schemas (`@bopacorp/shared`)
To maintain a single source of truth for your data models:
* Configure the React Native project to consume the existing `@bopacorp/shared` package. 
* This ensures all Zod schemas (`ApiSuccessSchema`, `ApiErrorSchema`, etc.) are identical across the API, web frontend, and mobile app.

### 2.2 Global Data Fetching
* **Library:** **TanStack Query (React Query)**.
* **Purpose:** Handles caching, background syncing, and pagination.
* **Wrapper:** Build a custom API client (using Axios or native `fetch`) that automatically unwraps the standard Bopacorp `{ success: true, data: {...} }` envelope, feeding the clean data into React Query hooks.

### 2.3 Global Error Handling
The backend relies on strict HTTP codes (`400`, `401`, `404`, `422`) and error payloads (`{ success: false, error: { code, message } }`).
* Implement a global response interceptor.
* Map specific codes (like `VALIDATION_ERROR`) to native mobile UI feedback, such as inline form errors or toasts (using a library like `react-native-toast-message`).

---

## 3. Authentication Flow (The Token Pair System)

The backend utilizes a fast, stateless Access Token (15m JWT) and a revocable Refresh Token (7d opaque string) stored in the database. Mobile environments require specific handling for this architecture.

### 3.1 Token Storage Strategy
* **Refresh Token:** Must be stored securely using `expo-secure-store` (encrypted on the device).
* **Access Token:** Kept in-memory (e.g., in a Zustand store or React Context) to prevent extraction attacks and optimize speed.

### 3.2 Silent Refresh Implementation
Implement an Axios interceptor to handle the rotation transparently:
1.  App makes a request. Backend returns `401 UNAUTHORIZED`.
2.  Interceptor pauses all outgoing requests.
3.  Interceptor reads the Refresh Token from `expo-secure-store`.
4.  App calls `POST /api/v1/auth/refresh`.
5.  If successful, the app saves the new token pair, resumes paused requests, and retries the original failed request.
6.  If failed (e.g., token expired or rotated due to replay detection), force the user to the login screen.

---

## 4. Feature Implementation: Employability Module

The employability module features a public job application endpoint (`POST /api/v1/employability/apply`) that accepts `multipart/form-data` uploads.

### File Uploads on Mobile
Native file systems do not operate like HTML web inputs.
* **File Selection:** Use `expo-document-picker`. This library opens the native iOS/Android file browsers (Files app on iOS, File Manager on Android) so the user can select their PDF resume.
* **Payload Construction:**
    ```javascript
    // Example logic for appending the mobile file to FormData
    const formData = new FormData();
    formData.append('file', {
      uri: document.uri, // The local file URI provided by Expo
      name: document.name,
      type: 'application/pdf'
    });
    // Append candidate metadata...
    formData.append('candidate[nationalId]', '...');
    ```

---

## 5. Phased Execution Plan

| Phase | Milestone | Focus Areas |
| :--- | :--- | :--- |
| **Phase 1** | **Setup & Foundation** | Initialize Expo, configure TS path aliases, connect to GitHub, and set up the iOS Simulator in VS Code. |
| **Phase 2** | **Networking & Shared Types** | Import `@bopacorp/shared`, configure Axios/fetch wrapper, and map backend error codes to native UI alerts. |
| **Phase 3** | **Authentication System** | Build the Login UI, implement `expo-secure-store`, and code the silent JWT refresh interceptor. |
| **Phase 4** | **Core Modules & UI** | Build mobile screens for main CRM entities using Expo Router, consuming data via React Query. |
| **Phase 5** | **File Handling (Employability)** | Implement the `expo-document-picker` flow and test multipart PDF uploads against the local backend. |
| **Phase 6** | **Polish & Testing** | Finalize UI styling, run physical device tests using Expo Go, and prepare for App Store / Play Store builds via Expo EAS. |
