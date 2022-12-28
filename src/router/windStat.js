// 风向统计
import db from '../db/db.js'
import express from 'express'

const windStat = express.Router()
windStat.get('', (req, res) => {
    const {city,year} = req.query
    console.log('风向统计',city,year)
    let sql = `select 风向 from ${city}${year}天气数据`
    db.query(sql, (err, results) => {
        if (!err) {
            let windTypeArr = []
            let map = new Map()
            results.forEach((item) => {
                item['风向'] = item['风向'].replace(/\s+/g, '')
                let type = item['风向'].split('风')[0] + '风'
                let level = item['风向'].slice(-2, -1)
                if (!windTypeArr.includes(type)) {
                    windTypeArr.push(type)
                }
                switch (level) {
                    case '0':
                        if (!map.has('无持续风向')) {
                            map.set('无持续风向', 1)
                        } else {
                            map.set('无持续风向', map.get('无持续风向') + 1)
                        }
                        break;
                    case '1':
                    case '2':
                        if (!map.has(type + '1-2级')) {
                            map.set(type + '1-2级', 1)
                        } else {
                            map.set((type + '1-2级'), map.get(type + '1-2级') + 1)
                        }
                        break;
                    case '3':
                    case '4':
                        if (!map.has(type + '3-4级')) {
                            map.set(type + '3-4级', 1)
                        } else {
                            map.set((type + '3-4级'), map.get(type + '3-4级') + 1)
                        }
                        break;
                }
            })
            let data = []
            for (let key of map.keys()) {
                let item = {
                    name: key,
                    value: map.get(key)
                }
                data.push(item)
            }
            res.send({
                success: true,
                data,
            })
        }
    })
})

export default windStat;