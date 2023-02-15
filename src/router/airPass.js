// 航空旅客数据
import db from '../db/db.js'
import express from 'express'

const airPass = express.Router()
airPass.get('',(req,res) => {
    let sql = `select * from air_passengers`
    db.query(sql,(err,result) => {
        if (!err) {
            res.send({
                success: true,
                data: result
            })
        }
    })
})

export default airPass;