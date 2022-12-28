import db from '../../db/db.js'
import express from 'express'

// 更新用户状态 审核 同意,不同意
const updateUserStatus = express.Router()
updateUserStatus.post('', (req, res) => {
    const {userid, status} = req.body
    console.log('更新状态', userid, status)
    let sql = `update user set status="${status}" where userid="${userid}"`
    db.query(sql, (err, result) => {
        if (!err) {
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


export default updateUserStatus;

