---
weight: 4
---

# Detección de Bordes

Se define como borde aquellos cambios en la dirección de la superficie, a los puntos 
en los que materiales diferentes entran en contacto, cambios abruptos en la luz o en la profundidad. 

Hay ocasiones en las que es necesario encontrar dichos bordes, por ejemplo si se desea segmentar una imagen, hallar 
elementos puntuales o reducir el la cantidad de información con la que se entrena determinado modelo de inteligencia
artificial. Afortunadamente existen efectos como el mostrado en esta sección, capaces de transformar una escena en una 
representación de sus contornos.

Para ilustrar lo anteriormente descrito, se aplica el efecto de detección de bordes sobre un conjunto de elementos coloreados y 
ubicados de forma aleatoria en el espacio.

{{< p5-iframe sketch="/posteffects/sketches/edge/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del Fragment Shader del Efecto.

{{< details "pixelate.frag" open >}}
```
precision mediump float;

uniform sampler2D tex;
uniform vec2 aspect;

varying vec2 texcoords2;

vec2 texel = vec2(aspect.x, aspect.y);

mat3 G[9];
mat3 G0 = mat3( 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0.5, 0, -0.5, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0) );
mat3 G1 = mat3( 0.5/sqrt(2.0), 0.5, 0.5/sqrt(2.0), 0, 0, 0, -0.5/sqrt(2.0), -0.5, -0.5/sqrt(2.0) );
mat3 G2 = mat3( 0, -0.5/sqrt(2.0), 0.5, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), -0.5, 0.5/sqrt(2.0), 0 );
mat3 G3 = mat3( 0.5, -0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), -0.5 );
mat3 G4 = mat3( 0, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0);
mat3 G5 = mat3( -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0, 0, 0, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0) );
mat3 G6 = mat3( 1.0/6.0, -1.0/3.0, 1.0/6.0, -1.0/3.0, 2.0/3.0, 1.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0 );
mat3 G7 = mat3( -1.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0, 2.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0, -1.0/3.0);
mat3 G8 = mat3( 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0 );
                                                
void main(void) {        
    G[0] = G0;
    G[1] = G1;
    G[2] = G2;
    G[3] = G3;
    G[4] = G4;
    G[5] = G5;
    G[6] = G6;
    G[7] = G7;
    G[8] = G8;

    mat3 I;
    float cnv[9];
    vec3 s;
            
    for (float i=0.0; i<3.0; i++) {
        for (float j=0.0; j<3.0; j++) {
            s = texture2D(tex, texcoords2.st + texel * vec2(i-1.0,j-1.0)).rgb;
            I[int(i)][int(j)] = length(s); 
        }
    }

    for (int i=0; i<9; i++) {
        float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
        cnv[i] = dp3 * dp3; 
    }

    float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
    float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M); 

    gl_FragColor = vec4(vec3(sqrt(M/S)), 1.0);
}
```
{{< /details >}}

Para entender este shader, hay que empezar por 
analizar esta sección:
```
mat3 G[9];
mat3 G0 = mat3( 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0.5, 0, -0.5, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0) );
mat3 G1 = mat3( 0.5/sqrt(2.0), 0.5, 0.5/sqrt(2.0), 0, 0, 0, -0.5/sqrt(2.0), -0.5, -0.5/sqrt(2.0) );
mat3 G2 = mat3( 0, -0.5/sqrt(2.0), 0.5, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), -0.5, 0.5/sqrt(2.0), 0 );
mat3 G3 = mat3( 0.5, -0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), -0.5 );
mat3 G4 = mat3( 0, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0);
mat3 G5 = mat3( -0.5/sqrt(2.0), 0, 0.5/sqrt(2.0), 0, 0, 0, 0.5/sqrt(2.0), 0, -0.5/sqrt(2.0) );
mat3 G6 = mat3( 1.0/6.0, -1.0/3.0, 1.0/6.0, -1.0/3.0, 2.0/3.0, 1.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0 );
mat3 G7 = mat3( -1.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0, 2.0/3.0, 1.0/6.0, -1.0/3.0, 1.0/6.0, -1.0/3.0);
mat3 G8 = mat3( 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0, 1.0/3.0 );
```
Si se escriben en forma matemática estas variables, es posible llegar a los siguientes kernels.

{{< katex display >}}
G_0 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    1 & 0 & -1 \\
    \sqrt{2} & 0 & -\sqrt{2} \\
    1 & 0 & -1 \\
\end{matrix} \right] \\

G_1 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    1 & \sqrt{2} & 1 \\
    0 & 0 & 0 \\
    -1 & -\sqrt{2} & -1 \\
\end{matrix} \right] \\

G_2 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    0 & -1 & \sqrt{2} \\
    1 & 0 & -1 \\
    -\sqrt{2} & 1 & 0 \\
\end{matrix} \right] \\

G_3 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    \sqrt{2} & -1 & 0 \\
    -1 & 0 & 1 \\
    1 & 0 & -1 \\
\end{matrix} \right] \\

G_4 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    0 & 1 & 0 \\
    -1 & 0 & -1 \\
    0 & 1 & 0 \\
\end{matrix} \right] \\

G_5 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    -1 & 0 & 1 \\
    0 & 0 & 0 \\
    1 & 0 & -1 \\
\end{matrix} \right] \\

G_6 = \frac{1}{6} \cdot \left[ \begin{matrix}
    1 & -2 & 1 \\
    -2 & 4 & 2 \\
    1 & -2 & 11 \\
\end{matrix} \right] \\

G_7 = \frac{1}{2\sqrt{2}} \cdot \left[ \begin{matrix}
    -2 & 1 & -2 \\
    1 & 4 & 1 \\
    -2 & 1 & -2 \\
\end{matrix} \right] \\

G_8 = \frac{1}{3} \cdot \left[ \begin{matrix}
    1 & 1 & 1 \\
    1 & 1 & 1 \\
    1 & 1 & 1 \\
\end{matrix} \right]
{{< /katex >}}

Aquellas son las **Máscaras de Frei-Chen**, las cuales constituyen una autobase bajo la cual se pueden representar todas 
las matrices {{< katex >}} 3 \times 3 {{< /katex >}} cambiando el escalar que las multiplica (Demostrasión fuera del alcance de este
trabajo); por tanto son una generalización de cualquier operación de enmascaramiento.

## Convolución.
```
    mat3 I;
    float cnv[9];
    vec3 s;
            
    for (float i=0.0; i<3.0; i++) {
        for (float j=0.0; j<3.0; j++) {
            s = texture2D(tex, texcoords2.st + texel * vec2(i-1.0,j-1.0)).rgb;
            I[int(i)][int(j)] = length(s); 
        }
    }
```
En el vector `s` se guardan los colores de los texeles adyacentes al pixel actual, para 
después almacenar su brillo en la matriz `I`.

```
    for (int i=0; i<9; i++) {
        float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
        cnv[i] = dp3 * dp3; 
    }

    float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
    float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M); 

```

Se almacenan los cuadrados de los productos punto de las filas de cada kernel 
y las de la matriz `I` en un arreglo de nueve componentes que contiene los valores de la convolución.
Finalmente es cuestión de obtener una suma de los cuatro primeros valores (`M`) y otra de todos los elementos (`S`) y se 
utiliza la raíz del cociente de estas cantidades para definir el valor del color del fragmento, el cual está 
en escala de grises.
```
    gl_FragColor = vec4(vec3(sqrt(M/S)), 1.0);
```

## Referencias:
* [Detección de Bordes en una Imagen](http://www4.ujaen.es/~satorres/practicas/practica3_vc.pdf)
* [G. Madruga, Efectos de Espacio de Imagen ](https://www.fing.edu.uy/inco/cursos/cga/Clases/2018/EfectosDeEspacioDeImagenGabrielMadruga.pdf)
* [Procesamiento de imágenes con derivadas - Detección de esquinas y bordes.](https://www.famaf.unc.edu.ar/~pperez1/manuales/cim/cap4.html)
