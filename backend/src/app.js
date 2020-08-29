const express = require('express')
const app = express()
const fs = require('fs')
const comentariosJSON = require("../analitics/comentarios_docentes.json");
const valoracionesJSON = require("../analitics/valoraciones_docentes.json");
const comunJSON = require("../data/comun.json");
const equivalenciasJSON = require("../data/equivalencias.json");

// middlewares
app.use(express.json())

// TODO: Revisar esto de los headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

// routes
app.get('/', (req, res) => {
  res.send('BEEEE')
})

app.post('/test', (req, res) => {
  console.log(req.body)

  const OUTPUT_FILE = 'log.txt' // Este tendría que ser el gente.txt creo

  // Ordeno los datos antes de apendearlo a la db (lo copio tal cual del test.php)
  const rowsNumber = 13
  const data = req.body.pio
  const cantidadDeComas = data.split(',').length - 1
  if (cantidadDeComas % rowsNumber == 0) {
    fs.appendFile(OUTPUT_FILE, `${data}\n`, (err) => {
      if (err) {
        console.log('ERROR al appendear')
      } else {
        console.log('SUCCESS')
      }
    })
  }
  res.json(req.body)
})

app.get('/comentarios', (req, res) => {
  console.log('NOS PIDIERON LOS COMENTARIOS')
  res.send(comentariosJSON)
})

app.get('/comun', (req, res) => {
  console.log('NOS PIDIERON LOS COMUN')
  res.send(comunJSON)
})

app.get('/equivalencias', (req, res) => {
  console.log('NOS PIDIERON LAS EQUIVALENCIAS')
  res.send(equivalenciasJSON)
})

app.get('/valoraciones', (req, res) => {
  console.log('NOS PIDIERON LaS VALORACIONES')
  res.send(valoracionesJSON)
})

app.get('/horarios/:cuatri/:anio', (req, res) => {
  console.log("CUATRI: ", req.params.cuatri)
  console.log("ANIO: ", req.params.anio)
  fs.readFile(`./data/Horarios_${req.params.cuatri}Q${req.params.anio}.json`, (err, data) => {
    // If error send a 500 status
    if (err) res.status(500).send(err);

    // Else parse the JSON file and send it
    else res.send(JSON.parse(data));
  });
})

app.listen(3000, () => {
  console.log('Server on port 3000')
})
