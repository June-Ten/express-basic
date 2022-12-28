import db from '../db/db.js'
import express from 'express'
import moment from "moment";

const predictMaxTemp = express.Router()

predictMaxTemp.get('/', (req, res) => {
    const {endDay} = req.query
    console.log('最高温度endDay',endDay)
    let startDay = moment(endDay,'YYYY-MM-DD').subtract(144, 'days').format('YYYY-MM-DD')
    console.log('startDay',startDay)
    let sql = `select 日期,最高温度 from 南京市2021天气数据`
    db.query(sql, (err, results) => {
        if (!err) {
            let newArr = []
            results.map((item, index) => {
                item.最高温度 = item.最高温度.replace('℃', '')
                let newArrItem = {
                    Date: item.日期,
                    Number: item.最高温度,
                }
                newArr.push(newArrItem)
            })
            let tempIndex = newArr.findIndex(newArrItem => newArrItem.Date === startDay)
            let resultArr = newArr.slice(tempIndex,145+tempIndex)
            res.send({
                success: true,
                data:resultArr,
            })
        }
    })
})


export default predictMaxTemp;

