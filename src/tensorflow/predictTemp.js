// 气温预测
import db from '../db/db.js'
import express from 'express'
import moment from "moment";

const predictTemp = express.Router()

predictTemp.get('/', (req, res) => {
    const {endDay, city} = req.query
    let startDay = moment(endDay, 'YYYY-MM-DD').subtract(144, 'days').format('YYYY-MM-DD')
    let sql = `select 日期,最高温度,最低温度 from ${city}2021天气数据`
    db.query(sql, (err, results) => {
        if (!err) {
            let newArr = []
            results.map((item, index) => {
                item.最低温度 = item.最低温度.replace('℃', '')
                item.最高温度 = item.最高温度.replace('℃', '')
                let newArrItem = {
                    Date: item['日期'],
                    minNumber: item.最低温度,
                    maxNumber: item.最高温度,
                }
                newArr.push(newArrItem)
            })
            let tempIndex = newArr.findIndex(newArrItem => newArrItem.Date === startDay)
            let resultArr = newArr.slice(tempIndex,145+tempIndex)
            res.send({
                success: true,
                data:resultArr,
            })
        } else {
            res.send({
                success: false,
            })
        }
    })
})
export default predictTemp;