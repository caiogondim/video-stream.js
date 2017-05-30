const fs = require('mz/fs')
const path = require('path')
const util = require('util')
const logger = require('logdown')('video-stream', { markdown: false })

function factory (opts) {
  if (!opts.dir) throw new Error('`opts.dir` is required')

  logger.log('`factory.opts`: ' + util.inspect(opts, { colors: true }))
  const { dir } = opts

  return async (req, res, next) => {
    logger.log('`request.headers`: ' + util.inspect(req.headers, { colors: true }))

    const { filename } = req.params

    try {
      const filePath = path.resolve(`${dir}/${filename}`)
      const fileStat = await checkIfFileExists(filePath)
      handleRequest(req, res, fileStat, filePath)
    } catch (error) {
      handleError(res, error)
    }
  }
}

function checkIfFileExists (filePath) {
  return fs.stat(filePath)
}

function handleError (res, error) {
  if (error.code === 'ENOENT') {
    logger.warn(error)
    res.status(404)
    res.send('Video not found on video-stream middleware.')
  } else {
    logger.error(error)
    res.status(500)
    res.send('Error on video-stream middleware.')
  }
}

function handleRequest (req, res, fileStat, filePath) {
  if (req.headers['range']) {
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

module.exports = factory
