# Constructor visual de formularios

**Demo en vivo:** https://sergio262001.github.io/SGStudio/demos/ux-01/index.html

## Problema
Armar formularios con reglas condicionales es lento y propenso a errores, y casi nunca se puede probar el resultado antes de publicarlo.

## Solución
Un constructor donde se arrastran campos, se definen reglas «mostrar solo si…» y se simula el formulario completo con validación.

## Decisiones de diseño
- **Arrastrar y soltar con alternativa por teclado:** botones ↑ ↓ y Alt + flechas, para cumplir WCAG 2.2 (2.5.7, movimientos de arrastre).
- **Reglas encadenadas:** si el campo origen está oculto, su valor se ignora. Así no aparecen campos "fantasma".
- **Detección de ciclos:** una regla circular se marca en el lienzo en lugar de bloquear la página.
- **Deshacer/rehacer:** las ediciones de texto se guardan al confirmar el campo, no en cada tecla, para que deshacer sea útil.
- **Simulación:** el foco va al primer error y los errores se anuncian a lectores de pantalla.

## Estructura
- `app/src/rules.js`: lógica pura (visibilidad, validación, ciclos, historial).
- `app/src/app.js`: interfaz.
- `app/tests/`: 10 pruebas de la lógica.

## Ejecutar
```bash
cd app
npm test     # pruebas
npm start    # http://localhost:5173
```
