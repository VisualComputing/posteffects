---
weight: 2
---

# Interacción con Modelos de Lenguaje.

Como fue mencionado anteriormente, los grandes modelos de lenguaje 
poseen la capacidad de llevar a cabo una amplia gama de tareas cuyo 
único factor común es casi la coherencia gramática; esto gracias a la 
ingente cantidad de datos con los que fueron entrenados y la abstracción del 
lenguaje plasmada en sus parámetros.

Mientras más específica sea la tarea que el modelo deba ejecutar, se le debe alimentar 
con información más puntual y entradas que entre más detalladas sean, deben tener una 
longitud mayor. Esto último puede ser problemático en tanto la cantidad de Tokens enviados al modelo 
representa un costo más elevado en caso de estar usando APIs de pago.

Debido a esto y a la necesidad de acotar las respuestas del modelo surge el concepto de **Programación de Modelos de Lenguaje (MLP)**, instrucciones 
con una sintaxis puntual que reducen el número de Tokens enviados al modelo y define de forma precisa las entradas del modelo, evitando la ambiguedad 
del lenguaje natural. Un ejemplo de este concepto es LMQL, que reduce el número de consultas enviadas al modelo y permite además de precisar la entrada, dar 
especificaciones sobre la salida; se basa en Python y tiene similitudes con SQL, considerando que también debe permitir la comunicación con fuentes de 
información (Beurer 2023).

Una de las herramientas que integra LMQL es LangChain, un framework cuyo propósito es crear aplicaciones potenciadas por modelos de lenguaje, ofreciendo una interfaz 
sencilla y versátil para interactuar con ellos. Facilita brindar de contexto al modelo usado, conectándolo a fuentes de datos, ejemplos o instrucciones;se añade la capacidad 
de instruirlo con cursos de acción dependiendo del comportamiento de las entradas o del entorno en sí en caso de funcionar como un agente. Además de ser compatible con Python, es 
posible usarlo con JavaScript, lo que hace de este framework la mejor opción para desarrollar este proyecto teniendo en cuenta que se quiere la mayor compatibilidad con p5.js posible.
 
Como trabajo futuro, aprovechando la curaduría hecha a los efectos analizados previamente, se espera generar un entorno de datos formado por los 
shaders desarrollados y un conjunto de etiquetas que especifiquen de forma adecuada su comportamiento. Aprovechando la compatibilidad con LangChain, es 
factible conectar p5.js con un modelo ligero como Vicuna, y ser este quien recoja la entrada suministrada por el usuario, es decir, una 
descripción en lenguaje natural del efecto que desea aplicar.

## Referencias
* L. Beurer-Kellner, M. Fischer, and M. Vechev, "Prompting Is Programming: A Query Language for Large Language Models," ETH Zurich, Switzerland, 2023. [Online]. Disponible en: [Aquí](https://doi.org/10.1145/3591300).
* [Creating My First AI Agent With Vicuna and Langchain](https://betterprogramming.pub/creating-my-first-ai-agent-with-vicuna-and-langchain-376ed77160e3)