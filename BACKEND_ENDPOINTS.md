# Endpoints del backend utilizados por `fifa-frontend`

Este documento describe los endpoints disponibles en el backend de `fifa-backend` y la integración actual del frontend.

## Base URL de la API

En `src/environments/environment.ts`:

- `apiUrl: 'http://localhost:3000/api'`

Esto significa que todas las llamadas del frontend usan el prefijo base:

- `http://localhost:3000/api`

## Endpoints de autenticación

Ruta base: `/api/auth`

- `POST /api/auth/register` - registrar un usuario
- `POST /api/auth/login` - iniciar sesión
- `POST /api/auth/logout` - cerrar sesión
- `GET /api/auth/me` - obtener datos del usuario autenticado

### Uso en el frontend

En `src/app/core/services/auth.service.ts`:

- `login(email, password)` usa `POST ${environment.apiUrl}/auth/login`
- `getMe()` usa `GET ${environment.apiUrl}/auth/me`
- `logout()` usa `POST ${environment.apiUrl}/auth/logout`

El frontend usa `withCredentials: true`, para cookies de sesión.

## Endpoints de jugadores FIFA

Ruta base: `/api/players-fifa`

- `GET /api/players-fifa` - obtener lista de jugadores FIFA
- `GET /api/players-fifa/export/csv` - exportar jugadores FIFA a CSV
- `GET /api/players-fifa/:id` - obtener jugador FIFA por ID
- `POST /api/players-fifa` - crear jugador FIFA
- `PUT /api/players-fifa/:id` - actualizar jugador FIFA
- `DELETE /api/players-fifa/:id` - eliminar jugador FIFA

### Uso en el frontend

En `src/app/features/players/services/players.service.ts`:

- `getPlayers()` usa `GET ${environment.apiUrl}/players-fifa`
- `getPlayerById(id)` usa `GET ${environment.apiUrl}/players-fifa/${id}`
- `createPlayer(player)` usa `POST ${environment.apiUrl}/players-fifa`
- `updatePlayer(id, player)` usa `PUT ${environment.apiUrl}/players-fifa/${id}`
- `deletePlayer(id)` usa `DELETE ${environment.apiUrl}/players-fifa/${id}`
- `downloadCSV()` usa `GET ${environment.apiUrl}/players-fifa/export/csv`

También construye query params (`name`, `team`, `position`, `version`) correctamente.

## Otros endpoints backend existentes

Ruta base: `/api/players`

- `GET /api/players`
- `GET /api/players/export/csv`
- `GET /api/players/:id`
- `POST /api/players`
- `PUT /api/players/:id`
- `DELETE /api/players/:id`

> Nota: el frontend actual no usa estos endpoints; en su lugar emplea `/api/players-fifa`. Se ha mapeado y migrado a la nueva base de datos brindada para el challenge.

## Verificación de integración

- El frontend está correctamente configurado para usar la misma base URL que el backend.
- `auth.service.ts` y `players.service.ts` apuntan a endpoints válidos del backend.
- La ruta de jugadores usada por el frontend (`/players-fifa`) coincide con los endpoints del backend.

## Conclusión

El frontend está alineado con los endpoints del backend:

- autenticación: `/api/auth`
- jugadores FIFA: `/api/players-fifa`

