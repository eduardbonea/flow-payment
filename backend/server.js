const express = require('express')
const app = express()
const port = 3111

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend works!')
})

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})
