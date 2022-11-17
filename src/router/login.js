import db from '../db/db.js'
import express from 'express'

const login = express.Router()

login.post('',(req,res)=> {
  let {username,password} = req.body
  let sql = `select password from user where username="${username}"`
  db.query(sql,(err,results)=> {
    if (!err) {
      console.log(results)
      if (password == results[0].password) {
        res.send({
          success: true,
        })
      }
    }
  })
})

export default login