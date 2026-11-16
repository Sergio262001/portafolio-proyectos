# Terraform

- `modules/red`: VPC con subredes públicas y privadas, etiquetadas para balanceadores de Kubernetes.
- `modules/cluster`: clúster EKS con logs de auditoría.
- `modules/registro`: repositorio ECR con etiquetas inmutables y escaneo al publicar.
- `envs/dev`: composición de los módulos. `staging` y `prod` siguen el mismo patrón con otros valores.

Antes de usar, reemplazar en `envs/dev/main.tf` el bucket y la tabla de bloqueos del backend.

```bash
cd envs/dev
terraform init
terraform validate
terraform plan
```
