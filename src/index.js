const fs = require(`fs`)
const path = require(`path`)
const util = require(`util`)
const logger = require(`logdown`)(`video-stream`, { markdown: false })

function factory (opts) {
  if (!opts.dir) throw new Error('`opts.dir` is required')

  logger.log('`factory.opts`: ' + util.inspect(opts, { colors: true }))
  const dir = opts.dir

  return function main (req, res, next) {
    logger.log('`request.headers`: ' + util.inspect(req.headers, { colors: true }))

    const { filename } = req.params

    // if (!fileExist()) return next()

    const filePath = path.resolve(`${dir}/${filename}`)
    const fileStat = fs.statSync(filePath)

    if (req.headers[`range`]) {
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
  }
}

module.exports = factory
