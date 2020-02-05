const express = require('express')
const consola = require('consola')
const mongoose = require('mongoose')
const compression = require('compression')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const songRouter = require('./routes/song');
const packRouter = require('./routes/pack');
const missionRouter = require('./routes/mission');
const fs = require('fs');
const https = require('https');
const redirectSSL = require('redirect-ssl');

const dataUpdater = require('./data/data');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
if(process.env.NODE_ENV === 'production') config.modules.push('@nuxtjs/pwa');

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { https_port, host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Init mongoose
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)
  mongoose.set('useUnifiedTopology', true)
  mongoose.set('useFindAndModify', false)
  const db = mongoose.connection
  db.on('error', console.error)
  db.once('open', function() {
    console.log('Connected to mongod server')
  })

  if (process.env.NODE_ENV === 'production') {
    mongoose.connect('mongodb://arcinfo:ARCINFOADMIN@localhost:27017/arcinfo')
  } else {
    mongoose.connect('mongodb://localhost:27017/arcinfo')
  }

  dataUpdater.update_db()

  // Give nuxt middleware to express
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(compression())
  app.use('/api/', indexRouter)
  app.use('/api/user', userRouter)
  app.use('/api/song', songRouter)
  app.use('/api/pack', packRouter)
  app.use('/api/mission', missionRouter)
  app.use(redirectSSL)
  app.use(nuxt.render)
  // Listen the server
  if (config.dev) {
    app.listen(port, host)
  } else {
    const https_options = {
      key: fs.readFileSync('/etc/letsencrypt/live/eatsteak.xyz/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/eatsteak.xyz/fullchain.pem')
    }
    app.listen(port, host)
    https.createServer(https_options, app).listen(https_port, host)
  }
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
