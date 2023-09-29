---
weight: 8
---

# Rayos


{{< p5-iframe sketch="/posteffects/sketches/rayos/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del Fragment Shader del efecto:

Cotidianamente no hay entornos uniformemente iluminados, la luz interactúa 
con los objetos de formas distintas considerando factores como su posición respecto 
al emisor y al observador, las propiedades intrínsecas de la onda y el material sobre el 
que cae. Es de este hecho que surge una de las principales aplicaciones de los shaders, los modelos 
de iluminación.

Con intensión de dar más realismo o vida a una escena, se aplican los modelos de iluminación. Estos 
simulan el comportamiento tanto de los emisores de luz, como de los materiales alumbrados en términos 
de opacidad y reflectancia. La iluminación es inherente a la escena, por lo que 
estos modelos no pueden considerarse como un efecto de posprocesado, sin embargo eso no impide realizar un 
efecto capaz de dotar a los objetos de haces fulgurantes.

La siguiente escena muestra un conjunto de objetos capaces de irradiar luz, dirigida 
por la posición del puntero del mouse sobre el sector izquierdo del sketch (que muestra el 
modelo previo a la aplicación del efecto) hacia la pantalla.

{{< details "rays.frag" open >}}
```
precision mediump float;

uniform sampler2D rtex;
uniform sampler2D otex;
uniform vec2 lightPositionOnScreen;
uniform float lightDirDOTviewDir;

varying vec2 texcoords2;

const int NUM_SAMPLES = 255;

void main(void){
    vec4 origColor = texture2D(otex, texcoords2.st);
    vec4 raysColor = texture2D(rtex, texcoords2.st);

    if (lightDirDOTviewDir>0.0){
        float exposure = 0.5/float(NUM_SAMPLES);
        float decay = 1.0;
        float density	= 1.25;
        float weight	= 6.0;
        float illuminationDecay = 1.0;

        vec2 deltaTextCoord = vec2( texcoords2.st - lightPositionOnScreen);
        deltaTextCoord *= 1.0 / float(NUM_SAMPLES) * density;
        vec2 textCoo = texcoords2.st;
    

        for(int i=0; i < NUM_SAMPLES ; i++){
            textCoo -= deltaTextCoord;
            vec4 tsample = texture2D(rtex, textCoo );
            tsample *= illuminationDecay * weight;
            raysColor += tsample;
            illuminationDecay *= decay;
        }
        raysColor *= exposure * lightDirDOTviewDir;
        float p = 0.3 *raysColor.g + 0.59*raysColor.r + 0.11*raysColor.b;
        
        gl_FragColor = origColor + p;
    } else {
        gl_FragColor = origColor;
    }
}
```
{{< /details >}}

La clave para comprender el funcionamiento de 
este efecto se encuentra principalmente en este fragmento:

{{< columns >}}
Se le envía al shader dos veces la textura correspondiente
al buffer que contiene la escena principal.
```
    rays_shader.setUniform('otex', main_pg);
    rays_shader.setUniform('rtex', main_pg);
```
<--->

En el fragment shader
Se indica el color actual del fragmento y del rayo que este 
emitirá, en este caso son idénticos, pero existe la posibilidad de que 
la luz proyectada esté dada por cualquier otra imagen enviada usando una textura. 
```
    vec4 origColor = texture2D(otex, texcoords2.st);
    vec4 raysColor = texture2D(rtex, texcoords2.st);
```

{{< /columns >}}

En los modelos de iluminación, la cantidad de 
luz que incide sobre un objeto está dada en gran parte por 
el producto punto entre la normal de la superficie y la dirección a la fuente de luz, tal es el 
caso en la reflexión difusa:
{{<katex display>}}
I_d = kL_d (N \cdot L_d)
{{</katex>}}
De este modo, la variable `lightDirDOTviewDir` se explica 
al establecer un paralelismo entre la normal de una superficie y la 
dirección de la cámara. La intensidad de los rayos que lleguen a la pantalla 
estará dependerá en gran medida de cuán alineados estén los vectores de vista y dirección 
de la luz (que es emitida por los objetos de la escena).
> Recuerde que si el producto punto es 0 no hay relación entre los vectores, y si es negativo 
la luz no llega a la cámara porque su dirección es opuesta.

```
    if (lightDirDOTviewDir > 0.0){
        ...
    } else {
        gl_FragColor = origColor;
    }

```

En caso de que los vectores tengan una relación aceptable es necesario definir 
las variables que dictarán el comportamiento de la luz. 
La exposición `exposure` influye en 
la intensidad del efecto y es importante notar que está normalizada por la cantidad de muestras. 
El decaimiento `decay` determina la disminusión de la intensidad de luz en relación a la distancia.
La densidad `density` determina cuántas muestras se toman por pixel. 
El peso `weight` indica cuanto contribuye cada muestra a la intensidad de la luz resultante.
Por último, el decaimiento de iluminación `iluminationDecay` controla cuánto cambia la intensidad de la luz en cada 
muestra individual. 
```
        float exposure = 0.5/float(NUM_SAMPLES);
        float decay = 1.0;
        float density	= 1.25;
        float weight	= 6.0;
        float illuminationDecay = 1.0;
```

Una muestra es una proyección de la textura de rayo cuyo color se modifica según los 
parámetros previamente expuestos. Cada muestra simula estar a mayor distancia de la pantalla que la 
anterior y presenta un corrimiento en su centro. Conforme la muestra tenga mayores valores, los centros 
tenderán al centro de la textura original partiendo de la posición de luz en pantalla.

{{< columns >}}

![Una una versión etérea de la imagen original se superpone a esta sin estar alineada](/posteffects/docs/Efectos/recursos/rays_0.png)
*Figura 1: 2 muestras*
<--->
![Dos versiones etéreas de la imagen original se superponen a esta sin estar alineadas](/posteffects/docs/Efectos/recursos/rays_1.png)
*Figura 2: 3 muestras*
<--->
![Tres versiones etérea de la imagen original se superponen a esta sin estar alineadas](/posteffects/docs/Efectos/recursos/rays_2.png)
*Figura 3: 4 muestras*
{{< /columns >}}

De esto se deduce que un rayo no es más que una pila de muestras atenuadas cuidadosamente según su posición respecto 
a la pantalla y que su efecto iluminador se debe entonces a la suma de sus colores individuales.

```
        vec2 deltaTextCoord = vec2( texcoords2.st - lightPositionOnScreen);
        deltaTextCoord *= 1.0 / float(NUM_SAMPLES) * density;
        vec2 textCoo = texcoords2.st;
    
        for(int i=0; i < NUM_SAMPLES ; i++){
            textCoo -= deltaTextCoord;
            vec4 tsample = texture2D(rtex, textCoo );
            tsample *= illuminationDecay * weight;
            raysColor += tsample;
            illuminationDecay *= decay;
        }
```
Finalmente, la exposición de la luz se aplica, se calcula la intensidad del color
de los rayos y se suma al color del fragmento actual.
```
        raysColor *= exposure * lightDirDOTviewDir;
        float p = 0.3 *raysColor.g + 0.59*raysColor.r + 0.11*raysColor.b;
        
        gl_FragColor = origColor + p;
```

## Referencias
* [Institute of New Imaging Technologies, Universitat Jaume I, Tema 5: Modelos de Iluminación y Sombreado, Síntesis de Imágen y Animación](https://repositori.uji.es/xmlui/bitstream/handle/10234/120644/tema05.pdf?sequence=1)