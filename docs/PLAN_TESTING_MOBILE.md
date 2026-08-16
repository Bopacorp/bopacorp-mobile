# Plan de testing básico por fases — BOPACORP Mobile

**Repositorio:** `bopacorp-mobile`  
**Proyecto:** BOPADIGITAL — BOPACORP S.A.  
**Alcance:** aplicación móvil del asesor comercial  
**Runner actual:** Jest + `jest-expo`  
**Fecha base:** 2026-08-15  
**Estado:** Fases 0, 1, 2, 3 y 4 ejecutadas; permanecen tres regresiones contractuales de Fase 2

## 1. Objetivo

Establecer una base de pruebas reproducible para las reglas que pueden causar pérdida de sesión, acceso incorrecto, datos comerciales mal enviados o fallos en el trabajo de campo.

La meta no es medir todo el árbol `app/` ni contar componentes visuales sin lógica. La meta es cubrir al menos el **80% del código crítico definido en este documento**, con ramas explícitas para autenticación, refresh, permisos de asesor, errores de red, cache, validaciones, geolocalización y carga de documentos.

Una prueba local no demuestra por sí sola que el API real, el GPS, el selector de archivos o un dispositivo funcionen. Cada capa debe conservar su propia evidencia.

## 2. Principios de alcance

1. La cobertura se calcula sobre una lista explícita de archivos críticos, congelada al inicio de la medición.
2. El 80% es sobre ese conjunto crítico, no sobre todo `src` ni sobre archivos visuales, generados o estáticos.
3. No se excluye código crítico únicamente porque sea difícil de probar. Si un archivo deja de ser crítico, la exclusión debe quedar justificada.
4. Los tests unitarios y de componentes usan mocks deterministas; no dependen de una base de datos, credenciales reales ni un servidor activo.
5. Las pruebas contra API real se separan de la suite básica y nunca se mezclan silenciosamente con el porcentaje unitario.
6. Los datos de prueba deben ser ficticios y no deben contener contraseñas, tokens, archivos de clientes ni datos personales reales.
7. `Pass` significa que la prueba fue ejecutada sobre una revisión conocida y tiene salida o artifact reproducible. La existencia del archivo de test no equivale a `Pass`.

Antes de cambiar código Expo o instalar paquetes nativos, se debe consultar la documentación versionada de [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/), conforme a `AGENTS.md`.

## 3. Qué se adopta de los repositorios hermanos

La estrategia se basa en patrones que ya utilizan `bopacorp-crm` y `bopacorp-web`, adaptados al runner Expo del mobile:

| Patrón | Uso observado en CRM/Web | Adaptación para Mobile |
|---|---|---|
| Scripts no interactivos | `test:run` y `test:coverage` | Agregar `test:run` y `test:coverage` sobre Jest |
| Setup común | `src/test/setup.ts` limpia estado y configura el entorno | Crear setup Jest para mocks de Expo, SecureStore, DocumentPicker y Location |
| Utilidades de render | `renderWithProviders` concentra Router/Auth/Query | Crear `renderWithProviders` para los providers reales del mobile |
| Fixtures | Datos tipados y deterministas por rol/entidad | Crear fixtures para asesor, clientes, negociaciones, visitas y documentos |
| Cobertura explícita | `coverage.include` enumera el código crítico | Configurar `collectCoverageFrom` solo para las rutas críticas del mobile |
| Integración separada | Configuración y carpeta separadas para contratos API | Mantener cualquier API real en una suite/configuración separada |
| CI | lint, typecheck, coverage, build y artifact | Añadir coverage y artifact al CI; mantener el smoke de dispositivo fuera del job unitario |

Referencias consultadas: [`bopacorp-crm/package.json`](../../bopacorp-crm/package.json), [`bopacorp-crm/vite.config.ts`](../../bopacorp-crm/vite.config.ts), [`bopacorp-web/docs/testing-plan-web/PLAN_TESTING_WEB.md`](../../bopacorp-web/docs/testing-plan-web/PLAN_TESTING_WEB.md) y sus workflows de CI.

No se copia Vitest al mobile: el repositorio ya está configurado con Jest Expo y `@testing-library/react-native`.

## 4. Línea base actual del mobile

### 4.1 Runner y CI

Actualmente existen:

- `jest.config.js` con preset `jest-expo`.
- `npm test`, que delega a `npm run test:run`.
- `npm run test:run` y `npm run test:coverage`, ambos no interactivos.
- `@testing-library/react-native`, `@testing-library/jest-native` y `react-test-renderer` como dependencias de desarrollo.
- setup común en `__tests__/setup.ts` para limpiar mocks, timers y storage.
- mocks explícitos para SecureStore, Location y DocumentPicker.
- `collectCoverageFrom` limitado al conjunto crítico inicial.
- CI con `npm ci`, `npm run lint`, `npx tsc --noEmit` y `npm run test`.

Actualmente faltan:

- umbral sobre código crítico;
- reporte LCOV/HTML publicado como artifact;
- pruebas de componentes/screen flows;
- prueba separada contra API real;
- evidencia de smoke test en Android/iOS o emulador.

### 4.2 Tests existentes

La suite encontrada contiene pruebas para:

- `services/api.ts`: envelope, errores y error de red;
- `services/ClientServices.ts`: cache e invalidación;
- validadores escritos dentro del propio archivo de test;
- `services/storage.ts`: web y nativo con SecureStore mockeado;
- snapshot de `StyledText`.

La validación actual de RUC, teléfono, observaciones y email está duplicada dentro de `__tests__/validation.test.ts`. En una fase posterior debe probarse el comportamiento real de los formularios o extraerse la regla a producción; un helper copiado en el test no protege el código de la aplicación.

## 5. Conjunto de código crítico

El conjunto se amplía por fases para que la cobertura sea honesta y útil.

### 5.1 Núcleo crítico inicial

Estos archivos deben entrar al primer gate de cobertura porque concentran autenticación, sesión, frontera HTTP, persistencia segura y reglas de datos:

- `services/api.ts`
- `services/storage.ts`
- `context/AuthContext.tsx`
- `services/ClientServices.ts`

### 5.2 Código crítico de interacción comercial

Después de estabilizar el núcleo, se incorporan las rutas que ejecutan acciones del asesor:

- `app/_layout.tsx` — redirección según sesión y grupo de rutas;
- `app/create-client.tsx`;
- `app/edit-client.tsx`;
- `app/create-negotiation.tsx`;
- `app/edit-negotiation.tsx`;
- `components/NegotiationDetailView.tsx` — visitas, GPS, documentos y estados;
- `app/(tabs)/documentation.tsx` — selección y carga de documentos.

Las pantallas de listado se incorporan cuando sus filtros, paginación, estados de carga/error o acciones tengan lógica propia que deba protegerse:

- `app/(tabs)/clients.tsx`;
- `app/(tabs)/negotiations.tsx`.

### 5.3 Exclusiones justificables

Pueden excluirse, documentándolo en el reporte de cobertura:

- imágenes, fuentes y assets;
- estilos sin decisión de negocio;
- primitivas visuales sin lógica propia;
- archivos generados y snapshots cuando no contengan lógica;
- rutas de error o HTML estático sin reglas de negocio;
- fixtures y archivos de test.

No deben excluirse por conveniencia `api.ts`, `AuthContext.tsx`, `storage.ts`, `ClientServices.ts` ni la lógica de formularios, documentos, visitas o autenticación.

La lista final debe quedar registrada en Jest antes de activar el gate. Si se modifica, se debe anotar el motivo y recalcular la cobertura.

## 6. Fases de implementación

### Fase 0 — Congelar alcance y obtener baseline

**Duración orientativa:** 0.5–1 día.  
**Objetivo:** saber qué se mide antes de añadir tests.
**Estado:** ejecutada; evidencia en `docs/TESTING_BASELINE_MOBILE.md` con ID `MOBILE-F0-2026-08-15-01`.

Actividades:

- Registrar SHA, Node, npm, versión de Expo y sistema operativo.
- Confirmar que las dependencias instaladas corresponden al `package-lock.json`.
- Ejecutar la suite existente sin modificarla.
- Registrar cantidad de archivos, tests, fallos, duración y warnings.
- Congelar el primer conjunto de cuatro archivos críticos.
- Identificar secretos, datos reales o archivos sensibles que no deben entrar en fixtures.
- Definir el comportamiento esperado de `[]` vacío frente a error de red en `ClientServices`.

Comandos previstos:

```bash
npm ci
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

Criterio de salida:

- Existe una línea base con SHA, fecha, entorno y resultado observado.
- No se presenta la línea base como cobertura final.

### Fase 1 — Endurecer el runner y el setup

**Duración orientativa:** 0.5–1 día.  
**Objetivo:** hacer que las pruebas sean repetibles en local y CI.
**Estado:** ejecutada; evidencia en `docs/TESTING_BASELINE_MOBILE.md` con ID `MOBILE-F1-2026-08-15-01`.

Actividades:

- Añadir scripts `test:run` y `test:coverage`.
- Crear un setup común para limpiar mocks, timers y storage después de cada prueba.
- Configurar mocks estables para `expo-secure-store`, `expo-location`, `expo-document-picker` y módulos nativos que no existan en Jest.
- Configurar reporters `text`, `lcov`, `html` y `json-summary` en `coverage/`.
- Configurar `collectCoverageFrom` con la lista de código crítico, excluyendo tests, assets y tipos.
- Posponer `renderWithProviders` y helpers de navegación hasta la fase de componentes, cuando existan flujos que los necesiten.
- Crear fixtures bajo `__tests__/fixtures/`; los helpers bajo `__tests__/utils/` quedan para la fase de componentes.

Criterio de salida:

- La suite puede ejecutarse sin watch mode.
- Los tests no dependen del orden de ejecución.
- Los módulos nativos están controlados por mocks explícitos.
- Existe un primer reporte de cobertura aunque el gate todavía sea informativo.

En esta ejecución el reporte quedó limitado a los cuatro archivos críticos iniciales. No se activó un umbral, no se modificó CI y no se instalaron dependencias nuevas.

### Fase 2 — Autenticación, storage y frontera API

**Duración orientativa:** 1–2 días.  
**Prioridad:** P0.  
**Objetivo:** proteger el perímetro de seguridad antes de probar pantallas comerciales.
**Estado:** implementada con pruebas P0; tres casos contractuales quedan rojos porque `api.ts` refresca también `login`, `refresh` y `logout`.

Casos mínimos:

#### Storage

- lectura, escritura y eliminación en web mediante `localStorage`;
- lectura, escritura y eliminación nativa mediante `SecureStore`;
- fallback seguro cuando storage falla;
- limpieza del refresh token durante logout o sesión inválida.

#### `api.ts`

- agrega `Authorization: Bearer` cuando hay access token;
- desenvuelve `{ success: true, data }`;
- normaliza `{ success: false, error }`;
- conserva respuestas que no son envelopes;
- normaliza errores de red;
- no intenta refresh en login, refresh o logout cuando corresponda;
- refresh exitoso actualiza ambos tokens y reintenta la solicitud original;
- varias solicitudes 401 esperan el mismo refresh;
- refresh fallido vacía la cola y activa logout;
- una solicitud reintentada no entra en un ciclo infinito.

#### `AuthContext.tsx`

- login exitoso solo acepta la sesión con rol `advisor`;
- login inválido propaga un error observable;
- una cuenta no asesora no entra a la aplicación móvil;
- restaura sesión desde refresh token;
- limpia sesión cuando `/auth/me` o refresh fallan;
- logout limpia estado aunque falle la revocación remota;
- `isLoading` termina tanto en éxito como en error.

Criterio de salida:

- Todos los caminos P0 de token, refresh, logout y rol asesor tienen test.
- Las pruebas no llaman a una API real.
- La cobertura del núcleo crítico se reporta por separado.
- Los tres casos de exclusión de endpoints están identificados como regresiones pendientes y no se ocultan con skips.

### Fase 3 — Servicios, cache y contratos de datos

**Duración orientativa:** 1–2 días.  
**Prioridad:** P0/P1.  
**Objetivo:** asegurar que las pantallas reciben datos correctos y que las mutaciones invalidan la cache adecuada.
**Estado:** implementada; las pruebas aisladas de `ClientServices.ts`, cache, mutaciones y upload pasan. La suite general conserva las tres regresiones contractuales documentadas en Fase 2.

Casos mínimos de `ClientServices.ts`:

- mapea correctamente clientes, negociaciones, documentos, tipos de documento, estados y visitas;
- conserva identificadores y relaciones de cliente/asesor/negociación;
- transforma fechas sin perder el valor esperado;
- genera payloads correctos para crear y editar clientes/negociaciones/visitas;
- usa los parámetros `limit` y `page` esperados;
- cachea respuestas dentro del TTL;
- devuelve datos nuevos después de una invalidación de clientes, negociaciones, documentos o visitas;
- diferencia respuesta vacía, error de red y error del API según el contrato de UX que se confirme;
- arma `FormData` correctamente para carga web y nativa;
- invalida documentos después de crear o eliminar un registro;
- no duplica ni cambia silenciosamente el `advisorId` enviado por la pantalla.

Técnicas:

- fixtures deterministas para asesor, segundo asesor, cliente propio, cliente ajeno, negociación, visita y documento;
- `it.each` para casos de extensiones, estados, permisos y límites;
- aserciones sobre URL, método, headers y body, no solo sobre que Axios fue llamado;
- tipos de `@bopacorp/shared` cuando el export actual cubra la entidad; no duplicar contratos sin revisar primero el paquete.

Criterio de salida:

- Las operaciones críticas de servicio tienen casos felices, inválidos, vacíos y de error.
- La invalidación de cache tiene regresiones directas.
- El test no confunde un `[]` por error con un `[]` válido sin que esa decisión quede documentada.
- Las ramas web y nativa de carga de documentos tienen pruebas aisladas.
- La cobertura del conjunto crítico se actualiza con la ejecución de esta fase.

### Fase 4 — Componentes y flujos básicos del asesor

**Duración orientativa:** 2–3 días.  
**Prioridad:** P0/P1.  
**Objetivo:** probar interacción real con React Native Testing Library, no helpers copiados en el test.
**Estado:** implementada; cinco suites aisladas y 25 pruebas cubren los flujos de clientes, negociaciones, visitas/GPS y documentación.

La implementación usa mocks deterministas de `expo-router`, autenticación, servicios, `expo-location`, `expo-document-picker`, calendario y WebBrowser. No requiere API, GPS, filesystem, SecureStore ni dispositivo real.

#### Clientes

- crear cliente con datos válidos;
- rechazar RUC, email, teléfono o campos obligatorios inválidos;
- mostrar estado de envío y evitar doble submit;
- mostrar error del API sin perder los datos escritos;
- editar únicamente el registro seleccionado.

#### Negociaciones

- crear negociación con cliente y asesor correctos;
- validar fechas y observaciones;
- editar estado, fechas y observaciones;
- mostrar error de transición sin dejar una pantalla falsamente actualizada;
- navegar al detalle con el identificador correcto.

#### Visitas y GPS

- solicitar ubicación cuando el flujo lo requiere;
- transformar coordenadas y timestamp en el payload esperado;
- continuar de forma controlada si el usuario niega permiso;
- rechazar observación vacía;
- evitar doble registro durante el envío;
- recargar la lista después de crear una visita.

#### Documentos

- abrir `DocumentPicker` y manejar cancelación;
- rechazar extensión o tamaño no permitido según contrato vigente;
- construir el multipart correcto;
- mostrar estado de carga, éxito y error;
- conservar la negociación y el tipo de documento seleccionados;
- no presentar una carga como exitosa si falla el upload o el registro posterior.

Criterio de salida:

- Cada flujo tiene camino feliz, validación, error y estado de carga.
- Los módulos nativos están mockeados en unit/component tests.
- Las pruebas de UI verifican texto/acciones/resultados observables, no detalles internos de implementación.

La cobertura de Fase 4 mantiene como limitación explícita que los formularios de cliente y negociación no exponen un estado propio de envío; por eso no se inventa una aserción de doble submit. La validación de RUC, email, teléfono y extensiones/tamaño de archivo continúa siendo responsabilidad del contrato vigente del API; los tests cubren los errores y la cancelación que la pantalla sí procesa.

### Fase 5 — Gate de cobertura y CI

**Duración orientativa:** 0.5–1 día.  
**Objetivo:** convertir la suite en un control reproducible de calidad.

Actividades:

- Ejecutar toda la suite con `npm run test:run`.
- Ejecutar `npm run test:coverage` con la lista crítica congelada.
- Activar primero un gate informativo y luego un umbral de al menos 80% sobre líneas/statements del conjunto crítico.
- Revisar manualmente las ramas de decisiones críticas: rol, 401, refresh, errores, permisos GPS y archivos.
- Ejecutar lint y TypeScript en la misma revisión.
- Actualizar `.github/workflows/ci.yml` para ejecutar cobertura y subir `coverage/` como artifact.
- Mantener `npm run build:web` como validación de build separada; no usarla para sustituir tests de runtime nativo.
- Guardar SHA, fecha, Node, npm, comandos, duración, resumen y artifacts.

Gate mínimo:

| Control | Criterio |
|---|---|
| Tests unitarios/componentes críticos | 100% pasan |
| Cobertura de líneas/statements críticas | ≥ 80% |
| Ramas de auth/refresh/rol/error | Casos válidos e inválidos explícitos |
| Lint | Sin errores |
| TypeScript | Sin errores |
| Artifact | `coverage/index.html` y `coverage/lcov.info` disponibles |
| API real | No requerido para aprobar la suite básica; se reporta aparte |
| Dispositivo | No requerido para cobertura; se reporta como smoke separado |

Criterio de salida:

- Un pull request puede ejecutar la suite sin intervención manual.
- El artifact permite revisar qué archivos entraron en el cálculo.
- El porcentaje no se reporta como global ni como evidencia de API/dispositivo.

### Fase 6 — Smoke test manual de dispositivo

**Estado:** posterior al gate básico.  
**Objetivo:** cubrir límites que Jest no puede demostrar.

Ejecutar en un emulador o dispositivo con la revisión registrada:

1. Login de un asesor de prueba.
2. Consulta de clientes.
3. Creación o edición de un cliente.
4. Creación de negociación.
5. Registro de visita con permiso GPS concedido.
6. Registro de visita con permiso GPS denegado.
7. Selección y carga de un documento de prueba.
8. Logout y recuperación de sesión.

Registrar:

- dispositivo/emulador y versión de Android/iOS;
- versión de Expo/React Native y build usada;
- SHA del repositorio;
- API/base URL sin secretos;
- estado de red;
- pasos, resultado esperado, resultado observado, screenshots y defectos/retests.

Este smoke test no aumenta la cobertura Jest. Su resultado tampoco prueba que todos los roles o endpoints del API estén autorizados correctamente.

## 7. Matriz mínima de riesgos y pruebas

| Riesgo | Código crítico | Casos mínimos | Nivel |
|---|---|---|---|
| Sesión expirada o refresh incorrecto | `services/api.ts`, `AuthContext.tsx`, `storage.ts` | 401, refresh exitoso/fallido, cola, logout | Unitario |
| Acceso de usuario no asesor | `AuthContext.tsx`, `app/_layout.tsx` | rol advisor permitido; rol distinto rechazado | Unit/component |
| Datos enviados al cliente equivocado | `ClientServices.ts`, formularios | IDs, advisor, payload y edición | Unit/component |
| Pérdida o falsa actualización de datos | `ClientServices.ts`, pantallas | error API, cache, invalidación, doble submit | Unit/component |
| GPS no disponible | `NegotiationDetailView.tsx` | permiso concedido/denegado, coordenadas inválidas | Component/smoke |
| Documento inválido o incompleto | `ClientServices.ts`, documentación | cancelación, extensión/tamaño, multipart, error | Unit/component |
| Interfaz vacía por error oculto | servicios y listados | distinguir vacío válido de error de red | Component/integración |

## 8. Fixtures y datos permitidos

Usar datos deterministas y anonimizados:

- `advisorA` y `advisorB` ficticios;
- cliente propio y cliente fuera del alcance;
- negociación en estado inicial y estado de cierre;
- visita con coordenadas válidas y visita sin coordenadas;
- documento PDF válido, extensión no permitida, archivo vacío y archivo sobre el límite;
- refresh tokens falsos, nunca tokens reales.

Los fixtures deben ser pequeños, legibles y reutilizables. No se deben copiar respuestas de producción ni subir archivos personales.

## 9. Evidencia requerida por ejecución

Cada ejecución relevante debe registrar:

- ID de ejecución;
- repositorio y SHA;
- fecha/hora, Node, npm y sistema operativo;
- comando exacto;
- cantidad de tests y resultado;
- cobertura y lista de archivos incluidos;
- artifact HTML/LCOV;
- defecto, fix SHA y retest cuando aplique;
- ambiente y dispositivo si es smoke o integración.

La cadena de trazabilidad será:

```text
Riesgo → Regla crítica → Test → Resultado observado → Artifact → Retest
```

## 10. Definición de terminado

El testing básico del mobile se considera terminado cuando:

- [ ] La línea base tiene SHA, comandos y resultado observado.
- [ ] El runner tiene `test:run`, `test:coverage` y setup común.
- [ ] Auth, storage y frontera API tienen casos exitosos, negativos y de límite.
- [ ] Clientes, negociaciones, visitas y documentos tienen casos de servicio y componente.
- [ ] El conjunto crítico está explicitado en la configuración de cobertura.
- [ ] La cobertura de líneas/statements del conjunto crítico es al menos 80%.
- [ ] Las ramas críticas de refresh, rol, error, GPS y archivos están cubiertas explícitamente.
- [ ] Lint y TypeScript pasan en la misma revisión.
- [ ] CI conserva el reporte de cobertura como artifact.
- [ ] El smoke de dispositivo está registrado por separado o aparece claramente como pendiente.
- [ ] No se presentan resultados históricos o estáticos como prueba actual.

## 11. Orden recomendado

1. Fase 0: alcance y baseline.
2. Fase 1: runner, mocks, fixtures y cobertura.
3. Fase 2: auth, storage y API boundary.
4. Fase 3: servicios y cache.
5. Fase 4: componentes y flujos del asesor.
6. Fase 5: gate y CI.
7. Fase 6: smoke en dispositivo.

El entregable de esta tarea es este plan. Las casillas anteriores permanecen sin marcar hasta que las ejecuciones y artifacts existan realmente.
