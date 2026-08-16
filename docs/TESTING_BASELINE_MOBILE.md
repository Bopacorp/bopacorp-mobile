# Baseline de testing — BOPACORP Mobile

**ID de ejecución:** `MOBILE-F0-2026-08-15-01`  
**Fecha/hora registrada:** `2026-08-15T18:31:00-05:00`  
**Repositorio:** `bopacorp-mobile`  
**SHA evaluado:** `e205fbad27e8a17e2fc6f50f2ac2a93c8a49cda9`  
**Estado:** Fases 0, 1, 2, 3 y 4 ejecutadas; cobertura informativa y tres regresiones contractuales pendientes

## 1. Estado inicial

Antes de ejecutar la baseline, el working tree estaba en `main` y tenía un único archivo no rastreado preexistente:

```text
?? docs/PLAN_TESTING_MOBILE.md
```

No se eliminaron, resetearon ni modificaron cambios existentes. `npm ci` no produjo cambios en `package.json`, `package-lock.json`, `jest.config.js` ni `.github/workflows/ci.yml`.

## 2. Entorno

| Elemento | Valor |
|---|---|
| Node | `v22.22.2` |
| npm | `10.9.7` |
| Expo | `~54.0.34` |
| React Native | `0.81.5` |
| Sistema | Linux x86_64 |
| Runner | Jest + `jest-expo` |
| Modo de ejecución | Jest no interactivo, `--runInBand` |

## 3. Comandos y resultados

| Comando | Resultado | Duración | Observaciones |
|---|---|---:|---|
| `npm ci` | Pass | 37 s | 941 paquetes añadidos; 943 auditados |
| `npm test -- --runInBand` | Pass | 12.69 s | 6 suites, 25 tests y 1 snapshot exitosos |
| `npm run lint` | Pass con warning | 1.19 s | 61 archivos revisados; 1 warning de parámetro no usado |
| `npx tsc --noEmit` | Pass | 13.34 s | Sin errores de TypeScript |

La primera invocación restringida de `npm ci` no produjo una terminación observable; se repitió la instalación con ejecución aprobada y finalizó correctamente. No se interpreta el primer intento como fallo del proyecto.

### 3.1 Suite ejecutada

Archivos detectados:

```text
__tests__/api-interceptor.test.ts
__tests__/cache.test.ts
__tests__/storage-native.test.ts
__tests__/storage-web.test.ts
__tests__/validation.test.ts
components/__tests__/StyledText-test.js
components/__tests__/__snapshots__/StyledText-test.js.snap
```

Resultado de Jest:

```text
Test Suites: 6 passed, 6 total
Tests:       25 passed, 25 total
Snapshots:   1 passed, 1 total
Time:        9.718 s
```

La duración total medida por `/usr/bin/time` fue `12.69 s`.

## 4. Warnings y deuda detectada

Los siguientes mensajes no hicieron fallar los comandos, pero deben quedar como entradas de la siguiente fase:

- `components/NegotiationCard.tsx:75`: Biome reportó que el parámetro `colorScheme` no se utiliza.
- `components/__tests__/StyledText-test.js`: apareció un `ReferenceError` tardío por importación después del teardown de Jest.
- El snapshot de `StyledText` generó advertencias de actualización React no envuelta en `act(...)` y mensajes posteriores al final de los tests.
- Jest terminó usando `--forceExit` y sugirió revisar posibles handles abiertos.
- Node mostró la advertencia deprecada del módulo `punycode`.
- `npm ci` mostró una peer dependency conflictiva entre `react@19.1.0` y `react-reconciler` que espera `react@^19.2.0`.
- npm informó paquetes deprecados, incluido `@testing-library/jest-native`, que ya no recibe mantenimiento.
- npm audit informó `30 vulnerabilities`: 11 moderate, 18 high y 1 critical.

No se ejecutó `npm audit fix`, no se actualizaron dependencias y no se modificó código para resolver estos puntos durante Fase 0.

## 5. Código crítico congelado

El primer conjunto de cobertura para la siguiente fase queda definido como:

- `services/api.ts`
- `services/storage.ts`
- `context/AuthContext.tsx`
- `services/ClientServices.ts`

Este conjunto cubre la frontera HTTP, el refresh de sesión, el almacenamiento de tokens, la autenticación del asesor, el mapeo de datos y la cache de servicios.

Las pantallas, formularios, GPS y carga de documentos permanecen como código crítico de fases posteriores; todavía no se cuentan en un porcentaje de cobertura.

## 6. Limitaciones de la baseline inicial

- La sección 3 conserva la fotografía histórica de Fase 0; los resultados actuales de Fase 1 están en la sección 8.
- La cobertura inicial de Fase 1 es informativa: todavía no existe un umbral ni se afirma el cumplimiento del 80%.
- No existen pruebas de `AuthContext.tsx` ni de los flujos completos de clientes, negociaciones, visitas o documentos.
- `__tests__/validation.test.ts` prueba validadores definidos dentro del propio test; esto no demuestra que los formularios reales estén protegidos.
- No se ejecutó API real, integración, emulador, dispositivo Android/iOS ni smoke test.
- Las Fases 2 y 3 no modificaron producción: los tests de exclusión de refresh para login, refresh y logout permanecen rojos porque `services/api.ts` intenta refrescarlos.
- El SHA base de Fase 1 fue `e205fbad27e8a17e2fc6f50f2ac2a93c8a49cda9`; los cambios de Fase 1 y Fase 2 permanecen sin commit y deben retestearse en la revisión que los incorpore.

## 7. Criterio de salida de Fase 0

- [x] SHA, entorno y estado inicial registrados.
- [x] Dependencias reinstaladas con `npm ci`.
- [x] Suite actual ejecutada y resultado observado registrado.
- [x] Lint ejecutado y warning registrado.
- [x] TypeScript ejecutado sin errores.
- [x] Conjunto inicial de código crítico congelado.
- [x] No se activó todavía un gate de cobertura ni se afirmó el cumplimiento del 80%.

La siguiente fase debe cubrir autenticación, storage y frontera API con casos de sesión, refresh, rol asesor, logout y errores; `ClientServices.ts` continuará en la Fase 3.

## 8. Fase 1 — Runner reproducible y cobertura inicial

**ID de ejecución:** `MOBILE-F1-2026-08-15-01`  
**Fecha/hora registrada:** `2026-08-15T18:42:23-05:00`  
**SHA base:** `e205fbad27e8a17e2fc6f50f2ac2a93c8a49cda9`  
**Estado del cambio:** modificaciones locales sin commit; el SHA identifica la revisión base sobre la que se ejecutó la fase.

### 8.1 Cambios implementados

- `package.json`: `test` ahora delega a `npm run test:run`; se añadieron `test:run` y `test:coverage` con `--runInBand`.
- `jest.config.js`: setup común, exclusión de `setup.ts` y fixtures como suites, `collectCoverageFrom` de los cuatro archivos críticos y reporters `text`, `lcov`, `html` y `json-summary`.
- `__tests__/setup.ts`: limpieza de mocks, spies, timers y storage; mocks base para SecureStore, Location y DocumentPicker.
- `__tests__/fixtures/critical-fixtures.ts`: datos tipados y ficticios para asesor, usuario no asesor, token, cliente, negociación y documento.
- `StyledText-test.js`: creación y desmontaje dentro de `act(...)`; el snapshot ahora representa el árbol renderizado real y no `null`.
- `.gitignore`: el directorio generado `coverage/` no se versiona.

No se añadió un umbral de cobertura, no se modificó CI, no se actualizaron dependencias y no se ejecutó `npm audit fix`.

### 8.2 Comandos y resultados

| Comando | Resultado | Evidencia observada |
|---|---|---|
| `npm run test:run` | Pass | 6 suites, 25 tests y 1 snapshot |
| `npm run test:coverage` | Pass | 6 suites, 25 tests y 1 snapshot; reporte generado en `coverage/` |
| `npm run lint` | Pass con warning | 63 archivos; warning preexistente en `components/NegotiationCard.tsx:75` |
| `npx tsc --noEmit` | Pass | Sin errores |
| `/usr/bin/time -p npm run test:run` | Pass | 6 suites, 25 tests y 1 snapshot; `real 3.24 s` |

La ejecución final no reprodujo el `ReferenceError` tardío, el warning de `act(...)` ni los mensajes de log posteriores al teardown observados en Fase 0. Permanece la advertencia deprecada de Node sobre `punycode`.

### 8.3 Cobertura crítica observada

El cálculo se realizó únicamente sobre `services/api.ts`, `services/storage.ts`, `context/AuthContext.tsx` y `services/ClientServices.ts`. Es un resultado de la suite existente, no una demostración de cobertura suficiente:

| Archivo | Líneas | Statements | Ramas | Funciones |
|---|---:|---:|---:|---:|
| `services/api.ts` | 38.70% | 38.09% | 46.87% | 15.38% |
| `services/storage.ts` | 80.76% | 80.76% | 83.33% | 100% |
| `context/AuthContext.tsx` | 0% | 0% | 0% | 0% |
| `services/ClientServices.ts` | 14.22% | 14.09% | 4.46% | 15.38% |
| **Total del conjunto configurado** | **20.54%** | **20.20%** | **19.88%** | **16.66%** |

El conjunto total todavía está por debajo de la meta del 80%; por eso la Fase 1 deja el reporte como informativo y la Fase 2 debe cubrir autenticación, storage y frontera API antes de activar un gate.

### 8.4 Criterio de salida de Fase 1

- [x] `test:run` y `test:coverage` son scripts explícitos y no interactivos.
- [x] Existe setup global con mocks nativos y limpieza entre pruebas.
- [x] Existen fixtures tipados, ficticios y reutilizables.
- [x] `collectCoverageFrom` enumera el código crítico inicial.
- [x] Se generan reportes de texto, LCOV, HTML y JSON summary.
- [x] La suite existente pasa sin warnings de teardown del snapshot.
- [x] Lint y TypeScript pasan; el warning restante está identificado como preexistente.
- [x] No se activó el umbral antes de tener pruebas P0 suficientes.

La siguiente fase debe cubrir `ClientServices.ts`, cache, mapeos, payloads y mutaciones; las tres regresiones de exclusión de refresh requieren una corrección de producción explícitamente autorizada.

## 9. Fase 2 — Autenticación, storage y frontera API

**ID de ejecución:** `MOBILE-F2-2026-08-15-01`<br>
**Fecha/hora registrada:** `2026-08-15T18:52:21-05:00`<br>
**SHA base:** `c0c4a4a97e018e3f7282a1677d8727ea087bc0c6`<br>
**Estado del cambio:** modificaciones locales sin commit; no se modificaron archivos de producción.

### 9.1 Pruebas implementadas

- `storage-native.test.ts` y `storage-web.test.ts`: fallos de lectura, escritura y eliminación; fallback seguro; ausencia de `window.localStorage` y aislamiento de módulos nativos.
- `api-interceptor.test.ts`: header Bearer, envelopes, errores, refresh exitoso, reintento, cola concurrente, refresh fallido, logout y prevención de ciclo infinito.
- `auth-context.test.tsx`: carga inicial, login asesor, rechazo de usuario no asesor, error de login, restauración de sesión, sesión inválida, logout exitoso y logout con fallo remoto.
- Se usaron adapters y mocks deterministas; ninguna prueba accede a API, SecureStore, GPS o archivos reales.

### 9.2 Resultados

| Comando | Resultado | Evidencia observada |
|---|---|---|
| `npm run test:run` | Rojo esperado | 7 suites; 50 tests; 47 pasan y 3 regresiones contractuales fallan |
| `npm run test:coverage` | Rojo esperado | Mismos 47/50; reporte generado en `coverage/` |
| `npm run lint` | Pass con warning | 64 archivos; warning preexistente en `components/NegotiationCard.tsx:75` |
| `npx tsc --noEmit` | Pass | Sin errores |

Los tres fallos corresponden exactamente a:

- `/api/v1/auth/login` recibe refresh automático ante 401.
- `/api/v1/auth/refresh` recibe refresh automático ante 401.
- `/api/v1/auth/logout` recibe refresh automático ante 401.

El test demuestra la discrepancia contra el contrato esperado; Fase 2 no la corrige por la decisión explícita de mantener el alcance solo en tests.

### 9.3 Cobertura crítica observada

| Archivo | Líneas | Statements | Ramas | Funciones |
|---|---:|---:|---:|---:|
| `services/api.ts` | 95.16% | 95.23% | 81.25% | 92.30% |
| `services/storage.ts` | 100% | 100% | 100% | 100% |
| `context/AuthContext.tsx` | 85.93% | 86.15% | 64.28% | 58.33% |
| `services/ClientServices.ts` | 14.22% | 14.09% | 4.46% | 15.38% |
| **Total del conjunto configurado** | **46.21%** | **45.66%** | **32.95%** | **48.14%** |

La cobertura mejoró desde Fase 1, pero no alcanza el 80% porque `ClientServices.ts` queda intencionalmente para Fase 3. No se activa todavía el gate.

### 9.4 Criterio de salida de Fase 2

- [x] Storage tiene casos felices, fallos y fallback para web y nativo.
- [x] API tiene casos de autorización, envelopes, errores, refresh, cola y retry.
- [x] AuthContext tiene casos de login, rol asesor, restore, logout y limpieza de sesión.
- [x] Los tests usan mocks deterministas y no servicios reales.
- [x] La cobertura crítica se actualizó con el reporte de Fase 2.
- [x] Lint y TypeScript pasan; el warning restante es preexistente.
- [ ] Suite completamente verde: bloqueada por las tres regresiones contractuales documentadas.

La siguiente fase debe cubrir componentes y flujos básicos del asesor. La corrección de las exclusiones de refresh queda fuera de esta implementación y requiere autorización para modificar `services/api.ts`.

## 10. Fase 3 — Servicios, cache y contratos de datos

**ID de ejecución:** `MOBILE-F3-2026-08-15-01`<br>
**Fecha/hora registrada:** `2026-08-15T19:01:07-05:00`<br>
**SHA base:** `c0c4a4a97e018e3f7282a1677d8727ea087bc0c6`<br>
**Estado del cambio:** modificaciones locales sin commit; no se modificaron archivos de producción ni dependencias.

### 10.1 Pruebas implementadas

- `client-services.test.ts`: mapeo de negociaciones, clientes, documentos y visitas; fechas, relaciones y valores de fallback; detalles y billing; cache y expiración TTL; lookups; errores; payloads de creación/edición; invalidación posterior a mutaciones.
- `client-services-upload-native.test.ts`: construcción de la parte nativa con `uri`, `name` y `type`, headers multipart y respuesta del upload.
- `client-services-upload-web.test.ts`: descarga controlada de la URI, construcción del `Blob`, `FormData`, headers multipart y respuesta del upload.
- `fixtures/critical-fixtures.ts`: fixtures ficticios para respuestas crudas y contratos de estados, visitas y carga documental.

Las pruebas usan mocks deterministas de `apiClient`, `react-native` y `fetch`; no llaman a API, filesystem, SecureStore, GPS ni selector de archivos reales. El comportamiento vigente de las listas que capturan errores y retornan `[]` queda cubierto explícitamente; los detalles que propagan errores también tienen casos de rechazo.

### 10.2 Comandos y resultados

| Comando | Resultado | Evidencia observada |
|---|---|---|
| `npm run test:run` | Rojo esperado | 10 suites; 72 tests; 69 pasan y 3 regresiones contractuales fallan |
| `npm run test:coverage` | Rojo esperado | 10 suites; 72 tests; 69 pasan, 3 fallan y 1 snapshot pasa; reporte generado en `coverage/` |
| `npm run lint` | Pass con warning | 67 archivos; warning preexistente en `components/NegotiationCard.tsx:75` |
| `npx tsc --noEmit` | Pass | Sin errores |

Las tres fallas siguen siendo exactamente las de Fase 2: `/api/v1/auth/login`, `/api/v1/auth/refresh` y `/api/v1/auth/logout` intentan un refresh automático después de un 401. No se ocultaron con `skip` y no se corrigieron porque eso requeriría modificar `services/api.ts` fuera del alcance de esta fase.

Las tres suites nuevas de Fase 3 pasan de forma aislada: 20 tests de servicios, 1 test de upload nativo y 1 test de upload web.

### 10.3 Cobertura crítica observada

| Archivo | Líneas | Statements | Ramas | Funciones |
|---|---:|---:|---:|---:|
| `services/ClientServices.ts` | 100% | 100% | 92.85% | 100% |
| `services/api.ts` | 95.16% | 95.23% | 81.25% | 92.30% |
| `services/storage.ts` | 100% | 100% | 100% | 100% |
| `context/AuthContext.tsx` | 85.93% | 86.15% | 64.28% | 58.33% |
| **Total del conjunto configurado** | **96.75%** | **96.85%** | **89.20%** | **88.88%** |

El total corresponde únicamente a los cuatro archivos críticos configurados en Jest. La cobertura sigue siendo informativa: todavía no existe un umbral automático ni se presenta como cobertura global de la aplicación. `ClientServices.ts` ya tiene todas sus líneas, statements y funciones ejecutadas; quedan ramas específicas de fallback y excepciones para revisión futura.

### 10.4 Criterio de salida de Fase 3

- [x] Mapeos de servicios, relaciones, fechas y valores de fallback cubiertos.
- [x] URLs, parámetros, métodos y payloads de mutaciones verificados.
- [x] Cache, TTL e invalidación de clientes, negociaciones, documentos y visitas cubiertos.
- [x] Errores de listas, detalles y lookups documentados según el contrato vigente.
- [x] Upload web y nativo cubierto con `FormData` y headers multipart.
- [x] Cobertura crítica actualizada y superior al 80% en líneas/statements del conjunto configurado.
- [x] Lint y TypeScript pasan; el warning restante es preexistente.
- [ ] Suite completamente verde: continúan las tres regresiones contractuales de Fase 2.

La siguiente fase es Fase 4, componentes y flujos básicos del asesor. La corrección de las tres exclusiones de refresh continúa siendo un trabajo separado que requiere autorización explícita para cambiar `services/api.ts`.

## 11. Fase 4 — Componentes y flujos básicos del asesor

**ID de ejecución:** `MOBILE-F4-2026-08-15-01`<br>
**Fecha/hora registrada:** `2026-08-15T19:26:44-05:00`<br>
**SHA base:** `c0c4a4a97e018e3f7282a1677d8727ea087bc0c6`<br>
**Entorno:** Node `v22.22.2`, npm `10.9.7`<br>
**Estado del cambio:** modificaciones locales sin commit; no se modificaron archivos de producción ni dependencias.

### 11.1 Pruebas implementadas

- `client-screens.test.tsx`: creación y edición de clientes, payload con campos recortados, detalles de validación, preservación de entrada tras error, filtros, navegación y paginación.
- `negotiation-screens.test.tsx`: selección de cliente/estado, `advisorId`, fechas locales, errores de creación/edición, filtros, navegación y paginación.
- `negotiation-detail-view.test.tsx`: carga de detalle, visitas, documentos y comentarios; creación con GPS concedido; continuidad sin GPS; error de visita y recarga de visitas.
- `documentation-screen.test.tsx`: búsqueda, cancelación de `DocumentPicker`, selección de metadatos, orden upload-registro, error de upload y filtro de estado.
- `document-card.test.tsx`: confirmación y eliminación de documento, refresco posterior y error sin refrescar.
- `jest.config.js`: el conjunto crítico ahora incluye las nueve pantallas/componentes ejercitados además de API, storage, autenticación y servicios.

Los módulos nativos y externos se sustituyen por mocks deterministas. Las pruebas no llaman API, GPS, selector de archivos, filesystem, SecureStore ni dispositivo real.

### 11.2 Comandos y resultados

| Comando | Resultado | Evidencia observada |
|---|---|---|
| `npx jest __tests__/client-screens.test.tsx __tests__/negotiation-screens.test.tsx __tests__/negotiation-detail-view.test.tsx __tests__/documentation-screen.test.tsx __tests__/document-card.test.tsx --runInBand --silent` | Pass | 5 suites; 25 tests pasan |
| `npm run test:run` | Rojo esperado | 15 suites; 94 tests pasan y 3 fallan; las 3 fallas son las regresiones contractuales de `api.ts` |
| `npm run test:coverage` | Rojo esperado | 15 suites; 94 tests pasan y 3 fallan; reporte HTML/LCOV generado en `coverage/` |
| `npm run lint` | Pass con warning | Sin errores; warning preexistente en `components/NegotiationCard.tsx:75` |
| `npx tsc --noEmit` | Pass | Sin errores |

Las tres fallas siguen siendo exactamente las de Fase 2: `/api/v1/auth/login`, `/api/v1/auth/refresh` y `/api/v1/auth/logout` intentan un refresh automático después de un 401. No se ocultaron con `skip` y no se corrigieron porque hacerlo requeriría modificar `services/api.ts` fuera del alcance autorizado.

### 11.3 Cobertura crítica observada

| Archivo | Líneas | Statements | Ramas | Funciones |
|---|---:|---:|---:|---:|
| `app/create-client.tsx` | 96.29% | 96.42% | 63.15% | 100% |
| `app/create-negotiation.tsx` | 82.43% | 82.43% | 56.66% | 58.33% |
| `app/edit-client.tsx` | 100% | 100% | 90% | 100% |
| `app/edit-negotiation.tsx` | 87.67% | 87.17% | 79.16% | 70% |
| `app/(tabs)/clients.tsx` | 95.55% | 91.66% | 72.72% | 90% |
| `app/(tabs)/documentation.tsx` | 79.20% | 77.66% | 77.27% | 72.72% |
| `app/(tabs)/negotiations.tsx` | 72.46% | 72.85% | 46.80% | 64.28% |
| `components/DocumentCard.tsx` | 66.66% | 63.63% | 34.37% | 75% |
| `components/NegotiationDetailView.tsx` | 78.23% | 77.70% | 58.47% | 54.16% |
| **Total del conjunto crítico configurado** | **87.76%** | **87.37%** | **69.71%** | **74.15%** |

El conjunto total conserva más de 80% en líneas y statements, que son las métricas del gate básico. Las ramas y funciones quedan informativas y requieren ampliación posterior; no se presentan como cobertura global ni como prueba de funcionamiento en dispositivo.

### 11.4 Criterio de salida de Fase 4

- [x] Flujos de clientes y negociaciones cubiertos con éxito, validación/error y navegación observable.
- [x] Visitas cubiertas con permiso GPS concedido, permiso denegado, payload y recarga.
- [x] Documentos cubiertos con cancelación, éxito, orden de operaciones, error y eliminación.
- [x] Mocks de módulos nativos y servicios sin llamadas externas.
- [x] Conjunto crítico ampliado y cobertura actualizada.
- [x] Lint y TypeScript pasan; el warning restante es preexistente.
- [ ] Suite completamente verde: continúan las tres regresiones contractuales de Fase 2.

La siguiente fase es Fase 5, gate informativo y CI. La corrección de las exclusiones de refresh continúa siendo un trabajo separado que requiere autorización explícita para cambiar `services/api.ts`.
