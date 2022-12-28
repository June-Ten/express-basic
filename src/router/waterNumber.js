// 全国各省份降水量
import db from '../db/db.js'
import express from 'express'

const waterNumber = express.Router()
waterNumber.get('',(req,res)=>{
    const {year} = req.query
    console.log('全国降水量',year)
    let sql = `select * from ${year}全国省降水量`
    db.query(sql,(err,results)=> {
        if (!err) {
            let data = results.map((item)=> {
                return {
                    name: item['省'],
                    value: parseInt(item['降水量'])
                }
            })
            res.send({
                success: true,
                data,
            })
        }
    })
})


export default waterNumber;