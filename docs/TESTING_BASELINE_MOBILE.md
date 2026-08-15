# Baseline de testing — BOPACORP Mobile

**ID de ejecución:** `MOBILE-F0-2026-08-15-01`  
**Fecha/hora registrada:** `2026-08-15T18:31:00-05:00`  
**Repositorio:** `bopacorp-mobile`  
**SHA evaluado:** `e205fbad27e8a17e2fc6f50f2ac2a93c8a49cda9`  
**Estado:** Fases 0 y 1 ejecutadas; cobertura crítica informativa, sin umbral

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
- El SHA de referencia es `e205fbad27e8a17e2fc6f50f2ac2a93c8a49cda9`; los cambios de Fase 1 permanecen sin commit y deben retestearse en la revisión que los incorpore.

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

La siguiente fase debe cubrir `services/api.ts`, `services/storage.ts` y `context/AuthContext.tsx` con casos de sesión, refresh, rol asesor, logout y errores; `ClientServices.ts` continuará en la Fase 3.
