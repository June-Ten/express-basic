// 统计每月的晴天天气
import express from  'express'
import db from '../db/db.js'
const monthlySunnyDay = express.Router()

monthlySunnyDay.get('',(req,res)=> {
    const {city,year} = req.query
    let sql = `select 日期,天气 from ${city}${year}天气数据`
    db.query(sql,(err,results)=> {
        if (!err) {
            const monthObj = {
                '01': 0,
                '02': 0,
                '03': 0,
                '04': 0,
                '05': 0,
                '06': 0,
                '07': 0,
                '08': 0,
                '09': 0,
                '10': 0,
                '11': 0,
                '12': 0,
            }
            results.map((item) => {
                let month = item['日期'].substring(5,7)
                if (item['天气'] === '晴') {
                    monthObj[month]++
                }
            })
            res.send({
                success: true,
                data: monthObj
            })
        } else {
            res.send({
                success: false,
            })
        }
    })
})

export default monthlySunnyDay;