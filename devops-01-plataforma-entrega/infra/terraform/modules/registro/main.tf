terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "nombre" { type = string }

resource "aws_ecr_repository" "this" {
  name                 = var.nombre
  image_tag_mutability = "IMMUTABLE" # una etiqueta publicada no cambia nunca

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

output "url" { value = aws_ecr_repository.this.repository_url }
