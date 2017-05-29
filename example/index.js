// Run `npm run download-example-movie` to, well, get an example movie to make this test work.

const path = require(`path`)
const express = require(`express`)
const videoStream = require('../src')

const app = express()

app.get('/video/:filename', videoStream({ dir: path.resolve(__dirname) }))

app.get(`/`, (req, res) => {
  res.send('Hello World')
  res.end()
})

app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})
