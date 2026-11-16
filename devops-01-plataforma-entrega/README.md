# Plataforma de entrega progresiva con GitOps

- `app/`: servicios de ejemplo (API y worker)
- `infra/terraform/`: módulos reutilizables y entornos dev, staging y prod
- `gitops/`: Argo CD y Argo Rollouts (fuente de verdad del despliegue)
- `policies/opa/`: políticas como código (Conftest)
- `.github/workflows/`: pipeline CI/CD
- `observabilidad/`: Prometheus, Grafana y OpenTelemetry
- `secretos/`: solo documentación y plantillas; nunca secretos reales
- `pruebas-carga/k6/`: pruebas de carga
- `runbooks/`: procedimientos de incidentes y simulacros (game days)
- `docs/`: decisiones de arquitectura
