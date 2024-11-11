terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.0"
    }
  }

  required_version = ">= 1.0"
}

provider "docker" {}

resource "docker_image" "hr2_server" {
  name = "podjisin/hr2-server:latest"
  build {
    context = "."
  }
}

resource "docker_container" "hr2_server" {
  image = docker_image.hr2_server.image_id
  name  = "hr2-server"
  command = ["npm", "start"]
  ports {
    internal = 5056
    external = 5056
  }
}

output "image_id" {
  value = docker_image.hr2_server.image_id
}