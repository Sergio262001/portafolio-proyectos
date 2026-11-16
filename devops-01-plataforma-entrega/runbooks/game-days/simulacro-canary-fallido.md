# Simulacro: canary con errores

**Objetivo:** comprobar que el análisis detiene y revierte una canary defectuosa.

## Preparación

- Entorno: `servicio-api-staging`.
- Desplegar una imagen con una ruta que devuelva 500 de forma intencional.

## Ejecución

1. Iniciar el despliegue y observar el paso del 20 % de tráfico.
2. Medir cuánto tarda el análisis en detectar el fallo.
3. Confirmar que el Rollout queda abortado y que la versión stable sigue atendiendo.

## Métricas a registrar

- Tiempo de detección
- Tiempo de rollback
- Peticiones fallidas durante el simulacro
