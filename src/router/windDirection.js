import express from  'express'
import db from '../db/db.js'
const windDirection = express.Router()

windDirection.get('',(req,res)=> {
    // 分类数组
    let classify = []
    // 最终结果数组
    let lastResult = []
    let sql = `select 风向 from 南京2021天气数据`
    db.query(sql,(err,results)=> {
        if (!err) {
            // 总共有多少个风向
            results.map((item)=> {
                if (classify.indexOf(item.风向) == -1) {
                    classify.push(item.风向)
                }
            })
            classify.map((classifyItem,index)=> {
                let temp= results.filter((resultsItem)=> {
                    return classifyItem == resultsItem.风向
                })
                lastResult.push({[classifyItem]:temp.length})
            })
            res.send(lastResult)
        }
    })
})

export default windDirection;