import mysql from 'mysql'


let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'weather' //数据库名称
})

export default connection