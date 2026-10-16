# Tipos de composición: requisitos operativos

Clasificación tomada de `tipos-composicion-publicidad-redes.md`, aportado por el usuario
el 14 de octubre de 2026. Esta referencia es autosuficiente y no necesita el archivo
original. Las jerarquías son reglas operativas de este skill, no leyes universales ni
pruebas de mayor conversión. No reutilices datos ficticios de los ejemplos del documento.

## 1. Producto destacado

- Entrada: foto real y mensaje de presentación o cualidad respaldada por el brief.
- Estructura: un producto principal reconocible, separado del fondo, con espacio para
  titular y marca. El texto y los objetos secundarios no ocultan rasgos identificativos.
- Fondo: antes de definirlo, aplica [Tratamiento de fondos](fondos.md). Si el usuario
  plantea un caso o situación, pregunta por el fondo, su intención y las características
  faltantes, y espera la respuesta antes de producir. Una acción no define el entorno.
  Respeta los datos aportados y completa solo las decisiones delegadas, manteniendo
  el producto como primer foco. No reclasifiques automáticamente como Producto en contexto.
- Jerarquía: producto → titular → marca y acción, si la acción forma parte del brief.
- Encuadre: muestra forma y empaque para presentación; muestra el detalle real cuando
  el mensaje trata sobre textura o acabado. No inventes rasgos fuera de las referencias.
- Validación: el producto es el primer foco y se reconoce al tamaño de visualización.
  Si aparece precio, ocupa un nivel secundario.

## 2. Producto en contexto

- Entrada: foto real y uso u ocasión definidos.
- Estructura: entorno relacionado con el uso, acción visible o inferible y producto
  identificable. Cada objeto secundario cumple una función en la escena. Las manos
  o personas presentes mantienen anatomía, escala y contacto coherentes.
- Jerarquía: producto en uso y acción → mensaje de la ocasión → marca y acción de compra.
  Omite la acción de compra si no pertenece al brief.
- Texto: ocupa una zona legible sin ocultar el producto ni la acción.
- Validación: se entiende qué se vende y su relación con la ocasión. No atribuyas
  rendimiento sin evidencia ni presentes sujetos generados como clientes reales.

## 3. Comparación

- Entrada: dos opciones o estados identificados, referencias de ambos y un criterio
  principal con datos verificables. Antes/después requiere evidencia real del resultado;
  una recreación generada no constituye esa evidencia.
- Estructura: dos paneles rotulados con encuadre, escala y condiciones comparables.
  Explica las diferencias mediante texto, sin depender solo del color. Alinea por
  criterio las filas de atributos adicionales.
- Jerarquía: opciones o estados → diferencia principal → conclusión y acción si está definida.
- Producción: genera ambos paneles, rótulos y conclusión en una sola operación, con
  las referencias originales asignadas a cada variante. No generes paneles separados
  para ensamblarlos ni pegues recortes de producto sobre fondos generados. No alteres evidencia visual de resultados documentados.
- Validación: rótulos correctos, diferencias respaldadas, escala sin exageración de
  ventajas y conclusión limitada a los criterios comprobados. Si se pide generar
  una falsa prueba de resultado, detén esa parte y solicita evidencia utilizable.

## 4. Producto con argumentos

- Entrada: foto real y dos o tres argumentos respaldados, o una reseña auténtica con
  texto, atribución y producto correspondiente. Solicita argumentos faltantes;
  no inventes afirmaciones para completar la lista.
- Estructura: producto visible y bloque de argumentos o anotaciones. En modalidad
  testimonio, la reseña sustituye la lista. Relaciona atributo y utilidad solo cuando
  ambos estén respaldados. Las flechas terminan en el detalle aludido; los acercamientos
  requieren referencias reales de ese detalle.
- Jerarquía: producto y razón principal → argumentos o prueba → acción si está definida.
- Validación: argumentos legibles al tamaño previsto y coincidentes con sus fuentes.
  No inventes sellos, certificaciones ni reseñas; conserva sentido y atribución del testimonio.

## 5. Oferta protagonista

- Entrada: oferta concreta, producto y presentación incluidos, cantidades y condiciones
  aplicables; moneda cuando haya precio. Usa precio anterior, porcentaje, fechas y
  disponibilidad solo si están suministrados o verificados. Una promoción temporal
  requiere vigencia real. Solicita el canal de compra si falta.
- Estructura: un dato comercial dominante, producto reconocible, condiciones cerca de
  la oferta y legibles, acción vinculada al canal de compra.
- Jerarquía: oferta → producto incluido → condiciones y acción.
- Datos: muestra precio final y moneda cuando corresponda; precio anterior en segundo
  nivel. Si publicas precio anterior, final y porcentaje, comprueba su consistencia
  aritmética y resuelve discrepancias antes de producir.
- Validación: se entiende qué recibe el comprador y bajo qué condiciones. No inventes
  urgencia. Otras ventajas no compiten con la oferta principal. Mostrar un pack no
  cambia el tipo cuando domina el precio o beneficio comercial.

## 6. Conjunto de productos

- Entrada: lista y fotos reales de los artículos o variantes, cantidades y relación
  comercial: pack completo o unidades vendidas por separado.
- Estructura: artículos organizados por contenido, secuencia o variante; título que
  expresa la relación y separación para contar e identificar productos. Distingue
  contenido incluido de objetos de ambientación.
- Jerarquía: conjunto y relación entre piezas → contenido u opciones → precio y acción
  cuando formen parte del brief.
- Escala: conserva proporciones relativas. Si una cuadrícula normaliza tamaños visuales,
  indica dimensiones reales cuando sean necesarias para comparar. No representes
  distintas vistas de un artículo como unidades adicionales.
- Validación: inventario visible y texto coinciden; no hay duplicados, faltantes ni
  variantes mezcladas; se distingue pack de surtido individual. El precio es secundario.

## Guardrail de producción para los seis tipos

Genera la pieza completa de una sola vez, incluidos todos los textos y elementos
gráficos. En Oferta protagonista, precio, promoción, condiciones y acción aparecen
en la generación inicial junto al producto. Está prohibido generar una base y añadir
la oferta después con cualquier herramienta. Si falla un elemento, regenera la pieza
completa; no edites ni superpongas elementos sobre el resultado.

## Control común

Antes de generar, aplica la comprobación de texto del brief en SKILL.md a cada pieza.
Si no hay texto definido ni información suficiente para inferirlo, pregunta al usuario
si desea incluir texto y espera su respuesta. La elección explícita de no incluir
texto se registra; si contradice el mensaje que define el tipo, resuelve el conflicto
antes de producir. No añadas textos de relleno para cumplir una estructura.


Registra tipo, modificadores, entradas y fuentes, bloques, jerarquía y validación por
pieza. En carruseles, aplica los requisitos por lámina. Corrige los incumplimientos
contra el contrato; no reclasifiques silenciosamente después de generar.
