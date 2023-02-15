 // aqi 空气质量
 import express from  'express'
 import db from '../db/db.js'
 const aqiStat = express.Router()

 aqiStat.get('',(req,res)=> {
     const {city,year} = req.query
     let sql = `select 日期,AQI指数 from ${city}${year}空气质量`
     // let sql = `select 日期,AQI指数 from 南京市2021空气质量`
     db.query(sql,(err,results)=> {
         if (!err) {
             let aqiArr = []
             results.map((item) => {
                 let newItem = {
                     date: item['日期'],
                     aqi: item['AQI指数']
                 }
                 let newArrItem = [item['日期'],Number(item['AQI指数'])]
                 aqiArr.push(newArrItem)
             })
             res.send({
                 success: true,
                 data: aqiArr
             })
         } else {
             res.send({
                 success: false,
             })
         }
     })
 })

 export default aqiStat;