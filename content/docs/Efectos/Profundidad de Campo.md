---
weight: 2
---

# Profundidad de Campo

La profunidad de campo corresponde al área e nla que el ojo 
percibe un elemento con la nitidez suficiente o cuanto de 
la imagen es visualizable de forma nítida, si lo es 
en su totalidad se dice que se tiene una Profundidad de 
Campo Máxima.

Los objetos más cercanos a un plano de foco en la escena tendrán una nitidez mayor 
a los más lejanos. Solo aquellos que se encuentran en el plano poseerán un enfoque perfecto teoricamente, sin 
embargo el ojo brinda un rango de holgura que flexibiliza esta apreciación.
La profundidad de campo está ampliamente relacionada con la apertura, ya que a mayor apertura, más puntos habrá fuera de 
foco; con la distancia focal, pues entre menor sea esta el área nítida de la imagen será mayor; 

La siguiente visualización corresponde a una implementación de la profundidad de campo a manera 
de efecto de posprocesado. las secciones superiores son respectivamente la escena principal y su 
correspondiente mapa de profundidad; la inferior es el efecto aplicado. El plano focal cambia conforme 
la posición de la esfera en movimiento varía.

{{< p5-iframe sketch="/posteffects/sketches/dof/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="925" >}}

## Código del Fragment Shader del efecto:

{{< details "dof.frag" open >}}
```
precision mediump float;

uniform sampler2D texture;
uniform sampler2D depthMap;
uniform float maxBlur; 
uniform float aperture;
uniform float focus;
uniform float aspect;

varying vec2 texcoords2;

void main() {
    vec2 aspectcorrect = vec2( 1.0, aspect );
    vec4 depth1 = texture2D( depthMap, texcoords2 );
    float factor = depth1.x - focus;
    
    vec2 dofblur = vec2 ( clamp( factor * aperture, -maxBlur, maxBlur ) );
    vec2 dofblur9 = dofblur * 0.9;
    vec2 dofblur7 = dofblur * 0.7;
    vec2 dofblur4 = dofblur * 0.4;
    vec4 col = vec4( 0.0 );
    
    col += texture2D( texture, texcoords2.st );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur7 );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur4 );
    
    gl_FragColor = col / 41.0;
    gl_FragColor.a = 1.0;
}
```
{{< /details >}}
Es importante tener en cuenta el aspecto, que es la relación 
entre las dimensiones de la imagen. Así mismo se extrae la profundidad 
del fragmento actual usando el mapa de profundidad calculado previamente y se calcula 
un factor de desenfoque que es la diferencia entre la coordenada `x`
 de la profundidad y el foco.
```
    vec2 aspectcorrect = vec2( 1.0, aspect );
    vec4 depth1 = texture2D( depthMap, texcoords2 );
    float factor = depth1.x - focus;
```

La distorsión estará dada por el factor de desenfoque, sin embargo no superará los límites 
establecidos por su valor máximo (que está dado por el usuario en los controladores de la escena). Considerando
además que la distorsión depende de la distancia al plano focal, se establecen tres valores adicionales que serán 
usados de acuerdo a cuán lejano está el foco respecto a la posición del fragmento y se establece una variable de 
acumulación de color.

```
    vec2 dofblur = vec2 ( clamp( factor * aperture, -maxBlur, maxBlur ) );
    vec2 dofblur9 = dofblur * 0.9;
    vec2 dofblur7 = dofblur * 0.7;
    vec2 dofblur4 = dofblur * 0.4;
    vec4 col = vec4( 0.0 );
```

La distorsión no se aplica usando una máscara en este caso, se usa la variable de acumulaición de color 
`col` ppara sumar los valores de diferentes puntos de la textura correspondiente al buffer de la escena y aplicarles 
su correspondiente factor de desenfoque de acuerdo a su posición.
```
    col += texture2D( texture, texcoords2.st );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.15, 0.37 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.37, 0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.40, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur7 );
    
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, -0.4 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, 0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.4, 0.0 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    col += texture2D( texture, texcoords2.st + ( vec2( 0.0, 0.4 ) * aspectcorrect ) * dofblur4 );
```
Finalmente se elimina la transparencia del color del fragmento y se establece el color acumulado como 
valor de su atributo.
```
    gl_FragColor = col / 41.0;
    gl_FragColor.a = 1.0;
```

## Referencias.
* [DZOOM, La Profundidad de Campo Explicada con Ejemplos](https://www.dzoom.org.es/profundidad-de-campo/)
* [Capture The Atlas, ¿Qué es la apertura de diafragma en fotografía?](https://capturetheatlas.com/es/que-es-la-apertura-de-diafragma-en-fotografia/)