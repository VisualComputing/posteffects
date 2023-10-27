---
weight: 9
---

# Mezcla de Efectos de Posprocesado

Si bien los ejemplos anteriores se explican a sí mismos y tienen un potencial intrínseco, es imposible aprovecharlo completamente 
desde el uso individual de cada efecto. La combinación de efectos de 
posprocesado ofrece una ámplia gama de posibilidades tanto estéticas como prácticas a cambio de un manejo cuidadoso 
de la estructura de la escena y la forma en que este se aplica.

Para este caso, la combinación de efectos se aplica sobre una escena conformada por objetos posicionados 
de forma aleatoria en el espacio y una esfera de ubicación variable que cumple el rol de elemento a enfocar 
cuando se desee aplicar `Profundidad de Campo`.

{{< p5-iframe sketch="/posteffects/sketches/mezcla/sketch.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam/p5.easycam.js" lib2=
"https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="625" height="625" >}}

Es importante destacar que esta implementación aplica los efectos en el orden en que fueron seleccionados y no 
en el que aparece listado en el sketch. Esto incrementa las posibilidades de experimentación y es la forma más sencilla 
de demostrar que la aplicación de efectos no es conmutativa.

{{< columns >}}

![El borde de la figura no es continuo, está formado por pequeños cuadritos](/posteffects/docs/Efectos/recursos/mezcla_0.png)
*Figura 1: Efecto de pixelado aplicado a una Detección de Bordes*.
<--->
![El borde de la imagen es continuo, es el contorno de una imagen pixelada](/posteffects/docs/Efectos/recursos/mezcla_1.png)
*Figura 2: Efecto de Detección de Bordes aplicado a un Pixelado*.

{{< /columns >}}

## Implementación de Mezcla de Efectos.

>Antes de ahondar en los detalles de la implementación, se especifica que con el objetivo 
de desarrollar una explicación práctica y evitar la lectura de elementos repetitivos y tal vez redundantes 
la totalidad del código no será mostrada, puede que algunas líneas incluso se alteren para resumir su significado.

En primer lugar deben declararse los buffer que contendrán cada uno de los efectos (`efecto_pg`), además de uno para la escena original 
(`main_pg`) y otro para la visualización actual (`current_pg`); lo mismo debe hacerse para los shaders correspondientes.
```
let current_pg, main_pg, caleido_pg, dof_pg; // etc  
let caleido_shader, dof_shader, edge_shader; // etc
```
Para aplicar los efectos en orden de selección, es necesario usar un arreglo que indique cuales 
efectos han sido seleccionados y en qué orden.
```
let effects = [0];
```
### Función `setup`.
Dentro de la función `setup` se inicializa cada buffer, se le asocia el shader 
correspondiente y se inicializan algunas de sus uniformes con valores por defecto. Con fines prácticos 
no se permite variar los parámetros de los shaders como en secciones anteriores ya que no es ese el objetivo actual.

```
  efecto_pg = createGraphics(width, height, WEBGL);
  efecto_pg.textureMode(NORMAL);
  efecto_pg.colorMode(RGB, 1);
  efecto_pg.shader(efecto_shader);
  efecto_shader.setUniform('uniforme', valor);
```

Cuando un efecto es seleccionado su controlador respectivo (`efecto_chk`) ejecuta un método 
que sirve para determinar el efecto actual y su orden de aplicación.
```
  efecto_chk.changed(() => {
    if (efecto_chk.checked()){
            effects.push(índice de efecto);
    } else {
      let idx = effects.indexOf(índice de efecto);
      effects.splice(idx, 1);
    }
  });
```
Cuando se selecciona un efecto, su índice asociado se añade al arreglo, cuando deja de 
aplicarse, dicho índice se elimina. De este modo se consigue que los índices asociados a cada efecto 
aparezcan dentro de la estructura en orden de aplicación, simulando una pila pero con la ventaja de poder 
retirar elementos que no estén en la cima.
A continuación se muestra la tabla de índices de la implementación actual:

| índice de efecto | Efecto |
|------------------|--------|
| 0 | Escena Original | 
| 1 | Caleidoscopio |
| 2 | Profundidad de Campo | 
| 3 | Detección de Bordes | 
| 4 | Desenfoque Horizontal | 
| 5 | Ruido Simplex | 
| 6 | Pixelado | 
| 7 | Rayos | 

### Funciones Adicionales
Para mapear los índices asociados a cada efecto al buffer dónde se aplican se 
emplea la siguiente función:
 
{{< details "Función buff" open >}}
```
function buff(n){
  let pg;
  if (n === 0){
    pg = main_pg;
  } else if (n === 1){
    pg = caleido_pg;
  } else if (n === 2){
    pg = dof_pg;
  }else if (n === 3){
    pg = edge_pg;
  } else if (n === 4){
    pg = horizontal_pg;
  } else if (n === 5){
    pg = noise_pg;
  } else if (n === 6){
    pg = pixelate_pg;
  } else if (n === 7){
    pg = rays_pg;
  }
  return pg;
}
```
{{< /details >}}

Para mapear los índices asociados a cada efecto al shader que lo implementa, se emplea 
la siguiente función:

{{< details "Función shdr" open >}}
```
function shdr(n){
  let effect;
  if (n === 1){
    effect = caleido_shader;
  } else if (n === 2){
    effect = dof_shader;
  }else if (n === 3){
    effect = edge_shader;
  } else if (n === 4){
    effect = horizontal_shader;
  } else if (n === 5){
    effect = noise_shader;
  } else if (n === 6){
    effect = pixelate_shader;
  } else if (n === 7){
    effect = rays_shader;
  } else {
    effect = null;
  }
  return effect;
}
```
{{< /details >}}

### Función `draw`.

Dentro de la función `draw` se aplican los efectos en el orden indicado 
por el arreglo, el cumplimiento de esto culmina tal que así:

```
  if (effects.length === 1){
    current_pg = main_pg;
  }
  
  for (let i = 1; i < effects.length; i++){
    let tx = buff(effects[i - 1]);
    let pg = buff(effects[i]);
    let sh = shdr(effects[i]) 
    sh.setUniform('tex', tx);
    
    if (effects[i] === índice del efecto){
      // Aplique las operaciones necesarias en 
      // Cada efecto que requiera ajustes adicionales.
    } else if (effects[i] === 7){ // Ejemplo: Efecto de Rayos:
      sh.setUniform('rtex', tx);
      sh.setUniform('lightPositionOnScreen', [1 - mouseX / main_pg.width, 1 - mouseY / main_pg.height]);
    }
    
    // Tener en cuenta que las coordenadas de textura 
    // están normalizadas.

    pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
    current_pg = pg;
  }
```
Para lograr esta generalización es necesario unificar la sintaxis de los shaders, de modo que 
la uniforme asociada a la textura que representa la escena siempre debe ser llamada `tex`. Es importante 
notar que cuando `0` es el único elemento del arreglo se retoma la escena original como textura a mostrar.

Finalmente se dibuja el resultado de la aplicación consecutiva de los elementos seleccionados y se resetea cada buffer.
```
  image(current_pg, 0, 0);
  
  main_pg.reset();
  current_pg.reset();
  efecto_pg.reset();
```
