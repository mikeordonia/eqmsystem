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
    let sql = 'select count(queuenumber) as waitings from queue_guidance where qStatus = "Waiting"'
    let query = conn.query(sql,(err, countqueue)=>{
        if(err){
            console.log(err)
        } else {
            let sql = 'select count(queuenumber) as senior from queue_guidance where qStatus = "Waiting" and status = "Senior/PWD"'
            let query = conn.query(sql,(err, countsenior)=>{
                if(err){
                    console.log(err)
                } else {
                    let sql = 'select count(queuenumber) as guest from queue_guidance where qStatus = "Waiting" and status = "Guest"'
                    let query = conn.query(sql,(err, countguest)=>{
                        if(err){
                            console.log(err)
                        } else {
                            let sql = 'select count(queuenumber) as student from queue_guidance where qStatus = "Waiting" and status = "Student"'
                            let query = conn.query(sql,(err, countstudent)=>{
                                if(err){
                                    console.log(err)
                                } else {
                                    let sql = 'select count(bookid) as pends from appointment_guidance where bookStatus = "Pending"'
                                    let query = conn.query(sql,(err, countappointment)=>{
                                        if(err){
                                            console.log(err)
                                        } else {
                                            res.render('admin_dashboard-guidance', {countqueue, countsenior, countguest, countstudent, countappointment})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})


module.exports = router;