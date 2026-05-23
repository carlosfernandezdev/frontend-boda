# Wedding Photobank — Frontend

SPA única para gestionar el banco de fotos/videos de la boda. La UI se adapta
según el rol del usuario logueado (invitado / novio / admin).

**Stack**: React + Vite + Tailwind + Axios + React Router.

## Estructura

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + providers
├── api/
│   ├── client.js         # Axios con interceptores (token + 401)
│   └── auth.js           # Endpoints de auth
├── context/
│   └── AuthContext.jsx   # Sesión, usuario, permisos
├── components/
│   ├── RutaProtegida.jsx # Guard de rutas (auth + permiso)
│   └── Layout.jsx        # Header adaptado al rol
├── pages/
│   ├── LoginPage.jsx
│   ├── RegistroPage.jsx
│   └── InicioPage.jsx    # Placeholder con diagnóstico de sesión
└── styles/
    └── index.css         # Tailwind + estilos base
```

## Setup

```bash
npm install
npm run dev
```

Abre en http://localhost:5173

## Conexión con el backend

Vite hace proxy de `/api` → `http://localhost:3000` (ver `vite.config.js`).
**El backend tiene que estar corriendo** en el puerto 3000 para que login/registro funcionen.

El token JWT se guarda en `localStorage` y el interceptor de Axios lo adjunta
en cada request. Si el backend responde 401, se limpia el token y se redirige
al login automáticamente.

## Cómo funciona la adaptación por rol

`AuthContext` carga el usuario desde `/api/auth/me`, que devuelve sus permisos.
El helper `tienePermiso('archivos.moderar')` decide qué se muestra. Ejemplos:

- Menú "Etapas" → solo si tiene `etapas.crear` (novios/admin)
- Menú "Usuarios" → solo si tiene `usuarios.asignar_rol` (admin)
- Rutas protegidas → `<RutaProtegida permiso="...">`

## Próximos pasos

- [ ] Galería de archivos con filtros (tipo / usuario / etapa)
- [ ] Componente de upload con drag & drop
- [ ] Vista de detalle de archivo
- [ ] Panel de moderación (novios)
- [ ] Gestión de etapas (CRUD)
- [ ] Gestión de usuarios (admin)
```
