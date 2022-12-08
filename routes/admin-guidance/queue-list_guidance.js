const express = require('express')
const router = express.Router()

const mysql = require('mysql2')
const app = express()
const port = 3000

app.set("view engine", "ejs")                   
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static("public"))

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eqmsystem',
    port: 3306
})



router.get("/", (req,res)=>{
    let sql = 'select * from queue_guidance where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
    let query = conn.query(sql,(err, rset1)=>{
        if(err){
            console.log(err)
        } else {
            let sql = 'select * from queue_guidance where qStatus = "Waiting" and status = "Senior/Pwd"'
            let query = conn.query(sql,(err, rset2)=>{
                if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_guidance where qStatus = "Pending"'
                let query = conn.query(sql,(err, rset3)=>{
                if(err){
                console.log(err)
                } else {
                    res.render('admin_queue-guidance', {rset1,rset2,rset3})
                }
                })
            }
            })
        }
    })
})


module.exports = router;