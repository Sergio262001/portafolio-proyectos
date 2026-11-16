# Alerta: ErrorBudgetQuemandoRapido

**Síntoma:** la disponibilidad de `servicio-api` cae por debajo del objetivo de 99.9 %.

## Pasos

1. Revisar el panel de disponibilidad y determinar si el problema viene de la versión stable o de la canary.
2. Si la canary está afectada, el análisis de Argo Rollouts debe haberla detenido. Confirmar con `kubectl argo rollouts get rollout servicio-api -n servicio-api-prod`.
3. Si es necesario, revertir con `kubectl argo rollouts abort servicio-api -n servicio-api-prod`.
4. Registrar el incidente y el tiempo hasta recuperación (MTTR).

## Verificación

- La disponibilidad vuelve a estar por encima de 99.9 % durante 15 minutos.
