Antes de arrancar la aplicación por primera vez, tiene que inicializar la bd. Para ello descomenta las lineas 50 hasta la 114 del archivo db.js

para conectar en mongodbCompass me he conectado a la ruta:
mongodb://localhost:27017/

El servidor de la practica está en localhost:3000


Para ejecutar se pone node index.js


El orden en el que se pasan los tests es:

usuario: registry,login,modificar,borrar
articulos: listar, buscar, consultar
cesta: añadir, ver, eliminar
pedidos: hacer,modificar,listar,eliminar

