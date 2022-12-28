// 天气分布统计
import db from '../db/db.js'
import express from 'express'

const weatherTypeStat = express.Router()
weatherTypeStat.get('', (req, res) => {
    const {city,year} = req.query
    let sql = `select 天气 from ${city}${year}天气数据`
    db.query(sql, (err, results) => {
        if (!err) {
            let map = new Map()
            results.forEach((item) => {
                let tempType = item['天气'].slice(-1)
                if (!map.has(tempType)) {
                    map.set(tempType, 1)
                } else {
                    let value = map.get(tempType) + 1
                    map.set(tempType, value)
                }
            })
            let data = []
            let typeData = []
            for(let key of map.keys()) {
                let item = {
                    name: key,
                    value: map.get(key)
                }
                if (item.name === '云') {
                    item.name = '多云'
                }
                typeData.push(item.name)
                data.push(item)
            }
            res.send({
                success: true,
                data,
                typeData,
            })
        }
    })
})

export default weatherTypeStat;