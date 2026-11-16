# ADR-001: Despliegue canary con análisis automático

**Estado:** aceptado

## Contexto

Los cambios deben llegar a producción con riesgo bajo y rollback rápido.

## Decisión

- Argo Rollouts con canary en pasos (20 %, 50 %, 100 %).
- Análisis automático sobre tasa de error y latencia p95 con Prometheus.
- Argo CD sincroniza desde git (GitOps) con `selfHeal`.

## Consecuencias

- Un despliegue defectuoso se detiene antes de llegar a todos los usuarios.
- La calidad de las métricas determina la calidad de la decisión: sin métricas, no hay análisis.
