import express from 'express'

const index = express.Router()

index.get('',(req,res)=> {
  res.send('hello world')
})

export default index