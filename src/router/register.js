import db from '../db/db.js'
import express from 'express'

const register = express.Router()
register.post('', (req, res) => {
    const {username, password} = req.body
    let sql = `select username from  user`
    db.query(sql, (err, results) => {
        if (!err) {
            for (let result of results) {
                console.log('result', result)
                if (result.username === username) {
                    res.send({
                        success: false,
                        msg: '已存在该用户名'
                    })
                    console.log('找到相同的了')
                    return;
                }
            }
            let innerSql = 'insert into user set  username=? , password=?,status=?'
            let params = [username, password, 'checkPending']
            db.query(innerSql, params, (err, innerResults) => {
                if (!err) {
                    console.log(innerResults, '插入成功')
                    res.send({
                        success: true,
                        msg: '注册成功,请等待审核'
                    })
                } else {
                    console.log('插入失败')
                    res.send({
                        success: false,
                    })
                }
            })
        } else {
            res.send({
                success: false,
                msg: 'sql发生错误'
            })
        }
    })

})
export default register;