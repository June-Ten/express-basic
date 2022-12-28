import db from '../../db/db.js'
import express from 'express'

// 用户管理
const manageUser = express.Router()
manageUser.get('',(req, res) => {
    let sql = `select userid,username,password,date,status from user where status !="default"`
    db.query(sql, (err, rows) => {
        if(!err) {
            res.send({
                success: true,
                data: rows,
            })
        } else {
            res.send({
                success: false,
            })
        }
    })
})

export default  manageUser;

