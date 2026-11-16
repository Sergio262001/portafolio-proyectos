# Canary Lab · Simulador de entrega progresiva

**Demo en vivo:** https://sergio262001.github.io/SGStudio/#/ver/devops-01

Simulador interactivo del flujo de este proyecto: pruebas → políticas OPA → imagen + SBOM → firma → Argo CD → canary 20 % → 50 % → 100 %.

## Escenarios
- **Cambio correcto**: llega a producción de forma gradual.
- **Error en producción**: el análisis canary detecta el fallo y hace rollback automático.
- **Prueba que falla**: CI lo detiene antes de construir.
- **Configuración insegura**: las políticas bloquean un contenedor como root.

Los umbrales (1 % de errores, p95 de 300 ms, 4 chequeos y 1 fallo tolerado) son los mismos de `gitops/rollouts/`.

## Ejecutar
```bash
npm test     # 11 pruebas del motor
npm start    # http://localhost:5175
```
