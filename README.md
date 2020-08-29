# Dolly - Sistema Automatizado de Encuestas Fiubenses

## Idea
El concepto es sencillo: un sitio web estático (hosteado en github.io) que
permite al usuario llenar una encuesta sobre los docentes de un curso,
y por otro lado, mostrar los resultados de las encuestas de docentes
para una materia en particular.

## Filosofía
Dolly es actualmente una prueba de concepto, por lo cual, está todo atado
con alambre.

El backend se encarga de persistir los datos crudos de las encuestas
enviadas por los usuarios en un CSV, y de procesarlas regularmente
para crearlas estadísticas (almacenadas en un json).

El frontend se encarga de traer los json del servidor, procesarlos,
realizar los filtrados correspondientes respecto a docentes, materias,
etc, y de enviar la información de las encuestas al servidor.
Así tambien, se encarga de levantar los json con los resultados
de las estadísticas y los comentarios, para mostrárselos al usuario
que lo requiera.

## Funcionamiento
Para garantizar que el estudiante conteste las encuestas de los docentes
auxiliares (JTP y Ayudantes), se le pide que ingrese la materia y el
cuatrimestre que la cursó. Con esta información, se busca en el listado
de materias robado del Organizador de Materias de Lugfi (un json)
y se listan todos los docentes de los cursos.

Luego de completar toda la encuesta, la información se manda en texto
plano al servidor, por medio de POST. El servidor realiza una pequeña
validación, y persiste la información en la base de datos (``gente.txt``).

Un crontab se encarga de ejecutar el script ``analitics\analisis.sh``,
el cual procesa la información de ``gente.txt`` y guarda los resultados
en los archivos ``analitics/valoraciones_docentes.json`` y
``analitics/comentarios_docentes.json``. Cuando el usuario quiere ver
los resultados, dichos json son levantados por el frontend, y con el 
selector de materias, se filtra la información correspondiente.

## Setup (Docker)
* Instalar [Docker](https://docs.docker.com/engine/install/)
* Instalar [Docker compose](https://docs.docker.com/compose/install/)
* Correr `docker-compose up` en la carpeta root del proyecto.

## Decisiones de diseño
Hay información en la [wiki](https://github.com/lugfi/dolly/wiki).

## Colaboradores y diseñadores
Vero: [verosupervero](https://github.com/verosupervero)

Fer: [fndk](https://github.com/fdnk)

Lucas: [sotlucas](https://github.com/sotlucas)

Luis: [LuisCusihuaman](https://github.com/LuisCusihuaman)
