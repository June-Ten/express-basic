import db from '../db/db.js'
import express from 'express'

const login = express.Router()

login.post('',(req,res)=> {
  let {username,password} = req.body
  let sql = `select password from user where username="${username}" and status="default"
            or  username="${username}" and status="agree"`
  db.query(sql,(err,results)=> {
    if (!err) {
      if (results.length === 0) {
        res.send({
          success: false,
          msg: '用户名不存在或正在审核中'
        })
        return
      }
      if (password == results[0]?.password) {
        res.send({
          success: true,
          username,
        })
      } else {
        res.send({
          success: false,
          msg: '密码错误',
        })
      }
    } else {
      res.send({
        success: false,
      })
    }
  })
})

export default login