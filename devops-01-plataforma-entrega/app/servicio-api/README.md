# servicio-api

API de ejemplo sin dependencias externas. Sirve para probar el pipeline, el contenedor y los despliegues progresivos.

| Ruta | Uso |
|---|---|
| `GET /healthz` | Liveness: el proceso responde |
| `GET /readyz` | Readiness: 200 si está listo, 503 si no |
| `GET /version` | Versión y commit desplegados |

## Ejecutar

```bash
npm test          # pruebas
npm start         # http://localhost:8080
```

Variables: `PORT` (8080), `APP_VERSION`, `GIT_COMMIT`.
