import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import config from '../config/config.js'
import db from './db/db.js'

import index from './router/index.js'
import login from './router/login.js'
import register from "./router/register.js";
import weatherQuery from "./router/weatherQuery.js";
import waterNumber from "./router/waterNumber.js";
import weatherTypeStat from "./router/weatherTypeStat.js";
import windStat from "./router/windStat.js";
import monthlySunnyDay from "./router/monthlySunnyDay.js";
import aqiStat from "./router/aqiStat.js";
import predictTemp from "./tensorflow/predictTemp.js";
import newPredcit from "./tensorflow/newPredict.js";
import airPass from "./router/airPass.js";
import manageUser from "./router/manageUser/manageUser.js"
import updateUserStatus from "./router/manageUser/updateUserStatus.js"
import deleteUser from "./router/manageUser/deleteUser.js"

import windDirection from "./router/windDirection.js";
import predictMaxTemp from "./tensorflow/predictMaxTemp.js";
import predictMinTemp from './tensorflow/predictMinTemp.js'
import test from "./tensorflow/test.js";

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
db.connect()
app.use('/',index)
app.use('/login',login)
app.use('/register', register)
app.use('/weatherQuery',weatherQuery)
app.use('/waterNumber',waterNumber)
app.use('/weatherTypeStat',weatherTypeStat)
app.use('/windStat',windStat)
app.use('/monthlySunnyDay', monthlySunnyDay)
app.use('/aqiStat', aqiStat)
app.use('/predictTemp',predictTemp)
app.use('/newPredcit', newPredcit)
app.use('/airPass',airPass)
app.use('/manageUser',manageUser);
app.use('/updateUserStatus',updateUserStatus)
app.use('/deleteUser',deleteUser)

app.use('/windDirection',windDirection)
app.use('/tensorflowMaxTemp',predictMaxTemp)
app.use('/tensorflowMinTemp',predictMinTemp)
app.use('/test',test)

app.listen(config.port,()=> {
  console.log('serve is running at'+config.port)
})