import db from '../db/db.js'
import express from 'express'

const weatherQuery = express.Router()
weatherQuery.post('', (req, res) => {
    const {city, month} = req.body
    console.log('天气查询Table',city, month)
    let sql = `select * from ${city}2021天气数据 where 日期 like  "_____${month}___" ` //
    db.query(sql, (err, results) => {
        if (!err) {
            let data = results.map((item)=> {
                return {
                    date: item['日期'],
                    week: item['星期'],
                    maxTemp: item['最高温度'],
                    minTemp: item['最低温度'],
                    weather: item['天气'],
                    windDirection: item['风向'],
                }
            })
            res.send({
                success: true,
                data,
            })
        }
    })
})

export default weatherQuery;