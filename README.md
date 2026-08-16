# BOPACORP Mobile

Aplicación móvil de BOPACORP para asesores comerciales. Permite gestionar clientes, negociaciones, visitas y documentos desde Android, iOS y web mediante Expo Router.

## Stack

- Expo SDK 54 y React Native 0.81.
- React 19 y TypeScript con `strict` habilitado.
- Expo Router para navegación.
- Axios para comunicación con la API.
- `@bopacorp/shared` para contratos y validaciones compartidas.
- Jest + `jest-expo` + Testing Library para pruebas.
- Biome para lint y formato.

La referencia versionada de Expo para este proyecto está disponible en [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).

## Requisitos

- Node.js 20.19 o superior; CI utiliza Node.js 22.
- npm.
- Un token con acceso de lectura al paquete privado `@bopacorp/shared` en GitHub Packages.
- Para ejecutar la aplicación nativa, un emulador Android, simulador iOS o dispositivo compatible con Expo.

## Instalación

El paquete `@bopacorp/shared` se instala desde GitHub Packages. Configura el token solamente en el entorno local; no lo guardes en el repositorio.

```bash
cp .npmrc.example .npmrc
export NPM_TOKEN="tu-token-de-github-packages"
npm ci
```

En GitHub Actions, el workflow usa el secret `NPM_TOKEN` del repositorio.

## Variables de entorno

`EXPO_PUBLIC_API_URL` define la URL base de la API. Si no se configura, la aplicación usa `http://localhost:3000`.

```bash
export EXPO_PUBLIC_API_URL="https://tu-api.example.com"
```

No agregues tokens, contraseñas ni archivos `.env` con secretos al control de versiones.

## Desarrollo

```bash
npm run start       # Inicia Expo
npm run android     # Abre Android
npm run ios         # Abre iOS
npm run web         # Abre la versión web
```

Para generar la exportación web se requiere el repositorio hermano `../bopacorp-shared`:

```bash
npm run build:web
```

## Calidad y testing

```bash
npm run lint
npx tsc --noEmit
npm test
npm run test:run
npm run test:coverage
```

La regla de testing prioriza el código crítico: autenticación, storage, API, servicios comerciales, formularios, visitas, geolocalización y documentos. El gate actual exige al menos 80% en líneas y statements del conjunto crítico configurado; no representa una cobertura global de toda la aplicación.

Las pruebas unitarias usan mocks deterministas y no sustituyen una validación contra API real, GPS, selector de archivos, emulador o dispositivo físico.

## CI

El workflow [`ci.yml`](.github/workflows/ci.yml) se ejecuta en push y pull request hacia `main` y `develop`. Ejecuta:

1. `npm ci` usando el registry privado y `NPM_TOKEN`.
2. Lint con Biome.
3. Typecheck con TypeScript.
4. Tests con cobertura y gate de 80%.
5. Publicación del reporte `coverage/` como artifact.

## Estructura principal

```text
app/                 Pantallas y rutas de Expo Router
components/          Componentes reutilizables y vistas de negocio
context/             Estado global, sesión y tema
services/            API, storage y servicios comerciales
constants/           Colores y estilos compartidos
__tests__/           Pruebas, setup y fixtures
docs/                Arquitectura, integración y plan de testing
assets/              Iconos, imágenes y fuentes
```

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Integración con el backend](docs/MOBILE_BACKEND_INTEGRATION.md)
- [Plan de testing por fases](docs/PLAN_TESTING_MOBILE.md)
- [Baseline y evidencia de testing](docs/TESTING_BASELINE_MOBILE.md)
- [Manual de usuario](docs/USER_MANUAL/App_User_Manual.pdf)
