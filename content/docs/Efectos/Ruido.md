---
weight: 7
---

# Ruido

Los algoritmos de ruido han sido una elegante forma de abordar problemas 
en distintas áreas, esto se debe a su capacidad para relacionarse con comportamientos 
caóticos o simplemente aleatorios. Han sido utilizados en la generación de terreno de forma 
procedural, simulación de físicas de movimiento de fluidos, texturización procedural para obtener 
materiales más realistas, etc. 

En esta sección, se hará uso de un algoritmo generador de ruido para causar distorsiones y movimiento 
en una imagen determinada.

{{< p5-iframe sketch="/posteffects/sketches/ruido/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="325" >}}

## Código del Fragment Shader del efecto:
 
{{< details "noise.frag" open >}}
```
precision mediump float;

uniform sampler2D tex;
uniform float frequency;
uniform float amplitude;
uniform float time;
uniform float speed;

varying vec2 texcoords2;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r){
	return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
                
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      
                
    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
                
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
                
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
                
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
                
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
                
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;

    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
        dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec2 texCoords = texcoords2.st + vec2(
        amplitude * (snoise(vec3(frequency * texcoords2.s, frequency * texcoords2.t, speed * time))),
        amplitude * (snoise(vec3(frequency * texcoords2.s + 17.0, frequency * texcoords2.t, speed * time)))
    );
    gl_FragColor = texture2D(tex, texCoords);
}
```
{{< /details >}}

Lo primero en hacerse es definir ciertas funciones importantes 
para el desarrollo de este efecto y la mejora de su desempeño. En primer 
lugar, considerando que `glsl` no cuenta con una operación de módulo, que se 
define como:
{{< katex display >}}
\mod(x, n) = x - n \cdot \lfloor \frac{x}{n} \rfloor
{{< /katex >}}

Se implementa {{<katex>}} \mod(\vec v, 289) {{</katex>}} para vectores de 
tres y cuatro dimensiones.
```
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
```
También se implementa una función para operaciones de permutación, que en 
este caso se refiere a una operación de hashing que se usará posteriormente. Es  
importante añadir que es gracias a esta que el ruido adquiere su característico comportamiento 
seudoaleatorio.
```
vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}
```
En ocasiones en las que se puede prescindir de la exactitud, es 
factible usar aproximaciones a funciones conocidas en pos de disminuir 
el tiempo de ejecución. Una buena forma de obtener estas aproximaciones es 
el uso de series de Taylor; la que será implementada es:

{{< katex display >}}
\frac{1}{\sqrt{x}} \aprox 1.79284291400159 - 0.85373472095314 \cdot x
{{< /katex >}}

```
vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159 - 0.85373472095314 * r;
}
```
### Ruido Simplex.

La función más importante de este efecto se conoce como **Ruido Simplex**, una 
mejora considerable sobre el **Ruido de Perlin** en términos de eficiencia computacional. Una de 
sus ventajas es la versatilidad que demuestra al poder ser implementada para cualquier dimensión, en este 
caso se usarán tres.

```
float snoise(vec3 v){
    ...
}
```
Conforme se hagan acercamientos a diferentes fragmentos 
de esta función, se darán algunas generalidades del funcionamiento de 
este algoritmo.
En primer lugar, se definen algunas constantes vitales para el resto de los cálculos.
```
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
```
La segunda componente de `C`, que es el factor que determina la distancia 
entre el baricentro de un  triángulo y el lado que su mediana interseca, funge como 
factor de sesgo; la primera componente ayudará a deshacer dicha transformación.

El algoritmo supone una malla de tetraedros irregulares abarcando el espacio y, por tanto, conteniendo 
los puntos de interés. Para mayor entendimiento, de momento es menester hacerse de una imagen geométrica de cada paso.

```
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
```
Como el punto actual (`v`) se encuentra en uno de los 24 tetraedros 
que llenan el espacio, es importante saber cual lo contiene, y una buena forma de 
empezar es hallar una esquina inicial. 

Para alinear la malla con los ejes espaciales, se hace una transformación de sesgo sobre 
el mundo y extrayendo las partes enteras de cada componente del vector `v`transformado es posible 
determinar en qué tetraedro se encuentra. Basta con deshacer el sesgado y restar ese antiguo indicador 
de ubicación a `v` para hallar elorigen deseado (`x0`). 

Ahora se debe encontrar el resto de los vértices 

```
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );            
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
```
Las funciones de paso son una buena forma de comparar los vectores y determinar 
cuales son los puntos más cercanos al origen del tetraedro para hallar los vértices 
de forma ordenada.

Se realiza una serie de permutaciones concatenadas sobre sumas de las componentes del vector `i`
```
    i = mod289(i);
    vec4 p = permute( permute( permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
```
Este vector `p` contiene ahora valores seudo aleatorios con los que 
se podrá acceder posteriormente a los gradientes y que además garantizan que 
los patrones formados por el ruido no sean repetitivos.

Gracias a la constante `D` se define un vector de normalización que servirá para 
calcular las coordenadas de los vértices y sus gradientes después de haber pasado 
por la permutación.
```
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
                
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
                
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
                
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
                
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
```

Luego de haber obtenido los gradientes, estos deben 
ser normalizados y mezclados.
```
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
```
Finalmente, se calcula el efecto de dichos gradientes sobre 
el punto de entrada y se retorna como resultado de la función.
```
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
        dot(p2,x2), dot(p3,x3) ) );
```
  
### Función Principal
Una vez desarrollado el algoritmo de ruido simplex, queda hacer uso de él 
y aplicarl, en este caso sobre los colores de la escena.
La textura se muestrea de modo que la amplitud, frecuencia y velocidad alteren la forma de las oscilaciones del ruido, que 
también dependerá principalmente del tiempo (en milisegundos) transcurrido desde la ejecución del programa.
```
void main() {
    vec2 texCoords = texcoords2.st + vec2(
        amplitude * (snoise(vec3(frequency * texcoords2.s, frequency * texcoords2.t, speed * time))),
        amplitude * (snoise(vec3(frequency * texcoords2.s + 17.0, frequency * texcoords2.t, speed * time)))
    );
    gl_FragColor = texture2D(tex, texCoords);
}
```

## Referencias:
* [Zapata. F, Utilizando Algoritmos Generadores de Ruido.](http://erecursos.uacj.mx/bitstream/handle/20.500.11961/2902/Poster.pdf?sequence=2&isAllowed=y)
* [Gustavson. S, Simplex noise demystified](https://www.researchgate.net/publication/216813608_Simplex_noise_demystified)
* [Gonzalez. P, GLSL Noise Algorithms](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)