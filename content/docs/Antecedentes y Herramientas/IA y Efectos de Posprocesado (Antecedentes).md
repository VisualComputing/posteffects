---
weight: 1
---

# La IA y los Efectos de Posprocesado.

Esta sección presenta una revisión de literatura, breve, no por omisión sino por 
falta de relación con la forma con la que en este proyecto se desea interactuar con los 
diferentes efectos. Esta lejanía no constituye un inconveniente per sé, sino es un reflejo 
de la actual manera de relacionar la inteligencia artificial y la computación gráfica.

(Diolazis 2022) Se desarrolla un modelo de iluminación basado en redes neuronales, capaz de predecir este efecto en las diferentes configuraciones de una escena con elementos variables (disposición de los objetos y materiales).

(Leimkühler 2018) Se consigue una optimización de la combinaciòn de los efectos de profundidad de campo y desenfoque de movimiento, que suele ser computacionalmente costoso. Esto se consiguió mediante la modificaciòn de representaciones dispersas de la función de dispersiòn de punto con una técnica de preprocesado conocida como spreadlets. estos se aplican al laplaciano de la imagen, consiguiendo el resultado deseado de forma más eficiente y bien acoplada a las áreas fuera de foco y al movimiento rápido.

(Tsiviliskiy 2017) Se desarrolló un efecto de posprocesamiento  que puede ser usado tanto en la detección de bordes como en la emulación del sombreado ambiental. Lo que lo diferencia de trabajos anteriores y aplicaciones más clásicas, es que bajo un mismo código se generan ambos efectos de forma simultánea. Su funcionamiento se debe únicamente a la aplicación de una textura de profundidad, prescindiendo de una textura normal en el espacio de pantalla y una de ruido adicional, gracias a ello, la cantidad de operaciones se reduce y lo hace más apto para aplicarse en dispositivos móviles.

(Nalbach 2017) A partir de redes neuronales convolucionales, se consigue aplicar efectos de oclusión y dispersión de luz únicamente a partir de los atributos de los pixeles, dejando de lado la programación explícita de shaders.

En síntesis, la influencia de la IA en la aplicación de efectos se centra en ejecutar transformaciones 
sobre escenas determinadas, evitando así la codificación de un shader que represente un efecto equivalente. Hace 
falta experimentar con modelos de lenguaje para rescatar el papel que juega el código en cuanto a eficacia y fiabilidad.

## Referencias
* Diolatzis, S., Philip, J., & Drettakis, G. (2022). Active exploration for neural global illumination of variable scenes. ACM Transactions on Graphics (TOG), 41(5), Article No. 171. doi:10.1145/3522735.
* Leimkühler, T., Seidel, H.-P., & Ritschel, T. (2018). Laplacian kernel splatting for efficient depth-of-field and motion blur synthesis or reconstruction. ACM Transactions on Graphics (TOG), 37(4), Article No. 55. doi:10.1145/3197517.3201379.
* Tsiviliskiy, Ilya V, Ruslan R Gaisin, and Vlada V Kugurakova. "Hybrid shader for simultaneous edge detection and ambient shading." QUID: Investigación, Ciencia y Tecnología 28.2 (2017): 345-351.
* Nalbach, Oliver, Elena Arabadzhiyska, Devang Mehta, Hans-Peter Seidel, and Thomas Ritschel. "Deep shading: convolutional neural networks for screen space shading." Computer Graphics Forum 36.3 (2017): 71-82.
