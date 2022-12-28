import db from '../../db/db.js'
import express from 'express'

// 删除用户
const deleteUser = express.Router()
deleteUser.post('',(req,res) => {
    const {userid} = req.body
    let sql = `delete from user where userid = "${userid}" `
    db.query(sql, (err, result) => {
        if(!err){
            res.send({
                success: true,
            })
        } else {
            res.send({
                success: false,
            })
        }
    })
})

export default deleteUser;