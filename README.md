# Proyecto React — Demo

Este repositorio contiene una aplicación React (Vite) de ejemplo con: login contra un API, manejo de token en Redux, rutas protegidas, pantalla de `Devices` y una lista externa pública con modal de detalle.

Características principales
- Login: POST https://api.qa.myintelli.net/v1/login (body JSON). El token devuelto se guarda en Redux.
- Devices: GET https://api.qa.myintelli.net/v1/devices con `limit`, `offset` y `search`. Autenticación Bearer Token.
- External: listado desde una API pública (superhero) con imágenes y modal de detalle.

Estructura mínima
- `src/pages` — páginas: `Login`, `Welcome`, `Devices`, `External`.
- `src/components/Layout.jsx` — AppBar y navegación según `modules` del login.
- `src/store` — Redux store y `authSlice` para token/modules.

Instalación (PowerShell)

```powershell
cd 'C:\Users\Tony\Desktop\Proyecto React'
npm install
npm run dev
```

Notas importantes
- El login de ejemplo usa las credenciales por defecto en la UI (`carlospea13+1@gmail.com` / `123456`). Puedes cambiarlas en `src/pages/Login.jsx`.

- La pantalla `Devices` realiza peticiones con el token: revisa la consola y network si hay errores de CORS o permisos contra la API `api.qa.myintelli.net`.
