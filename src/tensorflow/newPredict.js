// 气温预测
import db from '../db/db.js'
import express from 'express'
import moment from "moment";

const newPredcit = express.Router()

newPredcit.get('/', (req, res) => {
    let lastResult = {} // 最终结果
    const {endDay, city} = req.query
    let startDay = moment(endDay, 'YYYY-MM-DD').subtract(144, 'days').format('YYYY-MM-DD')
    let sql = `select 日期,最高温度,最低温度 from ${city}2021天气数据`
    let twosql = `select 日期,AQI指数 from 南京市2021空气质量`
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
            lastResult.data = resultArr
            // res.send({
            //     success: true,
            //     data:resultArr,
            // })
            db.query(twosql, (err, results) => {
                if (!err) {
                    let newArr = []
                    results.map((item) => {
                        let newItem = {
                            Date: item['日期'],
                            aqiNumber: item['AQI指数']
                        }
                        newArr.push(newItem)
                    })
                    // console.log('newArr', newArr)
                    let tempIndex = newArr.findIndex(newArrItem => newArrItem.Date === startDay)
                    let resultArr = newArr.slice(tempIndex,145+tempIndex)
                    lastResult.aqiData = resultArr
                    lastResult.success = true
                    res.send(lastResult)
                }
            })
        }
    })

})
export default newPredcit;