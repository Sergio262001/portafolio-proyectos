terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "nombre" { type = string }
variable "version_k8s" { type = string }
variable "vpc_id" { type = string }
variable "subnets" { type = list(string) }

resource "aws_eks_cluster" "this" {
  name     = var.nombre
  version  = var.version_k8s
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids              = var.subnets
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator"]
}

resource "aws_iam_role" "cluster" {
  name = "${var.nombre}-cluster"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cluster" {
  role       = aws_iam_role.cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

output "endpoint" { value = aws_eks_cluster.this.endpoint }
output "nombre" { value = aws_eks_cluster.this.name }
