package main

import rego.v1

deny contains msg if {
  input.kind in {"Rollout", "Deployment"}
  c := containers[_]
  not c.resources.limits.memory
  msg := sprintf("%s/%s: el contenedor '%s' no tiene límite de memoria", [input.kind, input.metadata.name, c.name])
}

deny contains msg if {
  input.kind in {"Rollout", "Deployment"}
  c := containers[_]
  c.securityContext.allowPrivilegeEscalation == true
  msg := sprintf("%s/%s: '%s' permite escalar privilegios", [input.kind, input.metadata.name, c.name])
}

deny contains msg if {
  input.kind in {"Rollout", "Deployment"}
  not input.spec.template.spec.securityContext.runAsNonRoot
  msg := sprintf("%s/%s: debe ejecutarse con runAsNonRoot", [input.kind, input.metadata.name])
}

deny contains msg if {
  input.kind in {"Rollout", "Deployment"}
  c := containers[_]
  endswith(c.image, ":latest")
  msg := sprintf("%s/%s: '%s' usa la etiqueta :latest", [input.kind, input.metadata.name, c.name])
}

containers contains c if {
  some c in input.spec.template.spec.containers
}
