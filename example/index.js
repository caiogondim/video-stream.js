const fs = require(`fs`)
const path = require(`path`)
const express = require(`express`)

const app = express()

app.get(`/`, (req, res) => {
  console.log(`Hit`)

  const filePath = path.resolve(`${__dirname}/movie.mp4`)
  const fileStat = fs.statSync(filePath)

  if(req.headers[`range`]) {
    const { range } = req.headers
    const parts = range.replace(/bytes=/, ``).split(`-`)
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1
    const chunkSize = (end - start) + 1

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
      'Accept-Ranges': `bytes`,
      'Content-Length': chunkSize,
      'Content-Type': `video/mp4`
    })
    fs.createReadStream(filePath, { start, end }).pipe(res)
  } else {
    res.writeHead(200, {
      'Content-Length': fileStat.size,
      'Content-Type': 'video/mp4'
    })
    fs.createReadStream(filePath).pipe(res)
  }
})

app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})
