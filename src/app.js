import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import config from '../config/config.js'
import db from './db/db.js'
import index from './router/index.js'
import login from './router/login.js'
import windDirection from "./router/windDirection.js";

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
db.connect()
app.use('/',index)
app.use('/login',login)
app.use('/windDirection',windDirection)

app.listen(config.port,()=> {
  console.log('serve is running at'+config.port)
})