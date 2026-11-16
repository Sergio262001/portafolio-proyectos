# Panel de simulación de escenarios

**Demo en vivo:** https://sergio262001.github.io/SGStudio/demos/ux-02/index.html

## Problema
Los paneles muestran el estado actual, pero decidir exige comparar varios escenarios con muchos parámetros a la vez.

## Solución
Un panel donde los parámetros se mueven y el resultado se recalcula al instante. Se guardan hasta 3 escenarios y se comparan lado a lado.

## Decisiones de diseño
- **Deslizador + campo numérico:** el deslizador explora y el campo da precisión. Los valores fuera de rango se corrigen al salir del campo, no mientras se escribe.
- **Series accesibles:** cada escenario tiene color y patrón de línea propios, para que se distingan sin depender del color.
- **Gráfico navegable con teclado:** ← → Home End recorren los meses y un texto anuncia los valores. La vista Tabla muestra los mismos datos.
- **Comparación:** la mejor opción de cada métrica lleva ★ y el texto «(mejor)» para lectores de pantalla.
- **Rendimiento:** los cambios se agrupan por cuadro de animación. Con 120 meses y 4 series se mantiene a ~60 fps.
- **Persistencia:** los escenarios se guardan en el navegador.

## Estructura
- `app/src/model.js`: modelo de simulación puro.
- `app/src/app.js`: interfaz y gráfico SVG.
- `app/tests/`: 10 pruebas del modelo.

## Ejecutar
```bash
cd app
npm test     # pruebas
npm start    # http://localhost:5174
```
