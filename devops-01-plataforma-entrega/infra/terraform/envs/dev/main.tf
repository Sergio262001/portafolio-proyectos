terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket         = "REEMPLAZAR-estado-terraform"
    key            = "devops-01/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "REEMPLAZAR-bloqueos"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { entorno = "dev", proyecto = "devops-01" }
  }
}

variable "region" {
  type    = string
  default = "us-east-1"
}

module "red" {
  source = "../../modules/red"
  nombre = "devops-01-dev"
  cidr   = "10.20.0.0/16"
  zonas  = ["us-east-1a", "us-east-1b"]
}

module "cluster" {
  source      = "../../modules/cluster"
  nombre      = "devops-01-dev"
  version_k8s = "1.31"
  vpc_id      = module.red.vpc_id
  subnets     = module.red.subnets_privadas
}

module "registro" {
  source = "../../modules/registro"
  nombre = "servicio-api"
}
