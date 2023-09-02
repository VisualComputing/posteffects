---
weight: 1
---

# Mapa de Profundidad

Un mapa de profundidad es una forma sencilla de visualizar cuán lejos se encuentran los elementos de una escena con respecto a un 
plano de visualización. La distancia entre dicho plano y cada punto se mapea en un canal de color
cuyo valor es proporcional al de  dicha magnitud

Este efecto se ilustra a continuación; ambas escenas muestran un cubo describiendo un círculo al rededor del eje Y. La escena de 
la derecha muestra una aplicación del Mapa de Profundidad.

{{< p5-iframe sketch="/posteffects/sketches/depth/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del fragment shader del efecto:

```
precision highp float;

// took from: https://learnopengl.com/Advanced-OpenGL/Depth-testing

void main() {
  // gl_FragCoord.z is in the range [0..1]
  gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
}
```

Para comprender este efecto basta con estudiar esta línea:
```
gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
```

En otras palabras, se extrae la coordenada Z de cada fragmento, y se 
guarda en un vector de cuatro componentes, que representará un color sin 
transparencia con el que se teñirán los fragmentos corresponientes.

