<img src="https://cdn.rawgit.com/caiogondim/video-stream.js/master/img/banner.svg" width="100%" />

<h1 align="center">video-stream.js</h1>

<br>

Express middleware for streaming video.

## Installation

```
npm install -S video-stream
```

## Usage

Call `videoStream` middleware passing the directory that we should look for videos.

```js
const path = require('path')
const express = require('express')
const videoStream = require('video-stream')

const app = express()

// video-stream route
app.get('/video/:filename', videoStream({ dir: path.resolve(__dirname) }))

// Your normal routes
app.get('/', (req, res) => {
  res.send('Hello World')
  res.end()
})

app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})
```

Check a working example on [example folder](https://github.com/caiogondim/video-stream.js/tree/master/example).

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
