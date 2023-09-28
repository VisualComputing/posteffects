---
weight: 3
---

# Pixelador

El pixelado es un efecto en el que la resolución de la imagen 
se baja de manera intencional. Su aplicación más común se encuentra en 
el ocultamiento de elementos sensibles o polémicos en una escena, sin embargo
en los últimos años ha sido usado frecuentemente en el sector artístico gracias 
a la estética PixelArt.

Con el objeto de visualizar mejor este efecto, se 
preparó una sencilla escena compuesta por objetos curvos
en movimiento. La estructura de estos elementos hace más notable 
la aparición de los pixeles, los cuales, gracias a la variación
de los parámetros del lienzo, no son necesariamente cuadrados.

{{< p5-iframe sketch="/posteffects/sketches/pixelate/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del Fragment Shader del efecto:

{{< details "pixelate.frag" open >}}
```
precision mediump float;

uniform sampler2D tex;
uniform float xPixels;
uniform float yPixels;

varying vec2 texcoords2;

void main() {
    vec2 texCoords = vec2(floor(texcoords2.s * xPixels) / xPixels, floor(texcoords2.t * yPixels) / yPixels);
    gl_FragColor = texture2D(tex, texCoords);
}
```
{{< /details >}}

El núcleo de este shader se encuentra en esta línea:
```
    vec2 texCoords = vec2(floor(texcoords2.s * xPixels) / xPixels, floor(texcoords2.t * yPixels) / yPixels);
```
Obtiene nuevas coordenadas de textura, cuyas componentes están dadas por la función

{{< katex display >}}
s_p(s) = \frac{\lfloor p * s \rfloor}{p}
{{< /katex >}}

Dónde {{< katex >}}s{{< /katex >}} es un componente de una coordenada de textura y {{< katex >}}p{{< /katex >}} indica 
la cantidad de resolución deseada para cada componente. La obtención de las nuevas coordenadas de textura se puede apreciar 
con ayuda de la siguiente gráfica.

![Esta gráfica muestra un conjunto de funciones escalonadas que reflejan como se transforman las coordenadas de textura para aplicar el pixelado](/posteffects/docs/Efectos/recursos/pixelate_0.png)

Para valores más elevados de {{< katex >}}p{{< /katex >}}, la coordenada de salida se aproxima más a su posición original.
```
    gl_FragColor = texture2D(tex, texCoords);
```
Finalmente el fragmento adquiere el color correspondiente a la nueva coordenada en la textura de entrada.