---
weight: 5
---

# Desenfoque Horizontal

Los filtros de desenfoque son un efecto en el que 
se suaviza la textura sobre la que este se aplica, de 
modo  que se atenúan las diferencias abruptas de color. 

Existen diferentes tipos de efectos de desenfoque, sin embargo en este 
apartado se tratará el desenfoque horizontal, que difiere de los otros al 
incrementar la pérdida de detalle sobre los elementos que se encuentren a mayor
distancia vertical de un horizonte dado.

La demostrasión de este efecto se hace sobre un conjunto de elementos aleatoriamente 
posicionados en el espacio, de modo que el observador pueda encontrar un objeto a 
diferentes alturas en la imagen y evidenciar de ese modo la forma en que el nivel de desenfoque
varía.

{{< p5-iframe sketch="/posteffects/sketches/horizontal/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del Fragment Shader del efecto.

{{< details "horizontal.frag" open >}}
```
precision mediump float;

uniform sampler2D tDiffuse;
uniform float h;
uniform float r;

varying vec2 texcoords2;

void main() {
    vec2 vUv = texcoords2.st;
    vec4 sum = vec4( 0.0 );

    float hh = h * abs( r - vUv.y );

    sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;

    gl_FragColor = sum;
}
```
{{< /details >}}

Considerando que `r` representa la altura del horizonte imaginario en la textura de entrada (por lo
que su valor está normalizado) y `h` el nivel de desenfoque, es más sencillo intuir el 
funcionamiento del shader a partir de esta linea:
```
    float hh = h * abs( r - vUv.y );
```

Es decir que `hh` es la distancia horizontal entre los pixeles cuya 
diferencia se atenuará posteriormente. esta cantidad es proporcional 
a la distancia entre la vertical de la coordenada actual de textura y el 
horizonte.

Como es usual, este  suavizado también depende de una convolución entre los 
valores de los pixeles y determinado kernel. En este caso, como los pixeles están siendo 
seleccionados unicamente en sentido horizontal, la máscara debe ser también un vector y el resultado 
de la operación (el nuevo color del fragmento) no es más que el producto punto entre estos elementos 

{{< katex display >}}
sum = (u - 4hh, u - 3hh, u - 2hh, u - hh, u, u + hh, u +2hh , u + 3hh, u + 4hh) \cdot \left[ \begin{matrix}
     0.051  \\
     0.0918  \\
     0.12245  \\
     0.1531  \\
     0.1633  \\
     0.1531  \\
     0.12245  \\
     0.0918  \\
     0.051 
\end{matrix} \right]
{{< /katex >}}

Dónde {{< katex >}}u{{< /katex >}} es el componente horizontal de la coordenada 
de textura actual.

```
    sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;

    gl_FragColor = sum;
```

## Referencias:
* [OpenGL - Programming Guide, Chapter 9: Texture Mapping](http://www.glprogramming.com/red/chapter09.html#name3)
* [Parte III: La Referencia de Funciones del GIMP, Capítulo 14, Filtros](https://docs.gimp.org/2.4/es/filters.html)