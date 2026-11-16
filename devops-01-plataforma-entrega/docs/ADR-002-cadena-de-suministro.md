# ADR-002: Seguridad de la cadena de suministro

**Estado:** aceptado

## Decisión

- Generar SBOM con Syft en cada build.
- Firmar la imagen con cosign (keyless en GitHub Actions).
- Desplegar por digest, nunca por etiqueta mutable.
- Bloquear manifiestos inseguros con Conftest en CI.
