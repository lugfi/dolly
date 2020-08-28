const express = require('express')
const app = express()
const fs = require('fs')

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
  fs.appendFile('log.txt', JSON.stringify(req.body), (err) => {
    if (err) {
      console.log('ERROR al appendear')
    } else {
      console.log('SUCCESS')
    }
  })
  res.json(req.body)
})

app.listen(3000, () => {
  console.log('Server on port 3000')
})
