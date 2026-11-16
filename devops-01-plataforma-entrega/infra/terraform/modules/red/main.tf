terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "nombre" { type = string }
variable "cidr" { type = string }
variable "zonas" { type = list(string) }

resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = var.nombre }
}

resource "aws_subnet" "privada" {
  count             = length(var.zonas)
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.cidr, 4, count.index)
  availability_zone = var.zonas[count.index]
  tags = {
    Name                              = "${var.nombre}-privada-${count.index}"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "publica" {
  count                   = length(var.zonas)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.cidr, 4, count.index + 8)
  availability_zone       = var.zonas[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name                     = "${var.nombre}-publica-${count.index}"
    "kubernetes.io/role/elb" = "1"
  }
}

output "vpc_id" { value = aws_vpc.this.id }
output "subnets_privadas" { value = aws_subnet.privada[*].id }
