require('dotenv').config()
import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import api from './api'
import config from './config.json'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'
import winston from 'winston'
import mongoose from 'mongoose'

let app = express()
app.server = http.createServer(app)

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'access.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
)

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
)

// api router
app.use('/v1', api({ config, logger }))

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.server.listen(
  {
    port: process.env.PORT || config.port,
    host: '0.0.0.0'
  },
  () => {
    console.log(`Started on port ${app.server.address().port}`)
  }
)

export default app
