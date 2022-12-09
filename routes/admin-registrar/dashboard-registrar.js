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
    host: 'sql6.freesqldatabase.com',
    user: 'sql6583589',
    password: 'Cg4k4hRynz',
    database: 'sql6583589',
    port: 3306
})



router.get("/", (req,res)=>{
    let sql = 'select count(queuenumber) as waitings from queue_registrar where qStatus = "Waiting"'
    let query = conn.query(sql,(err, countqueue)=>{
        if(err){
            console.log(err)
        } else {
            let sql = 'select count(queuenumber) as senior from queue_registrar where qStatus = "Waiting" and status = "Senior/PWD"'
            let query = conn.query(sql,(err, countsenior)=>{
                if(err){
                    console.log(err)
                } else {
                    let sql = 'select count(queuenumber) as guest from queue_registrar where qStatus = "Waiting" and status = "Guest"'
                    let query = conn.query(sql,(err, countguest)=>{
                        if(err){
                            console.log(err)
                        } else {
                            let sql = 'select count(queuenumber) as student from queue_registrar where qStatus = "Waiting" and status = "Student"'
                            let query = conn.query(sql,(err, countstudent)=>{
                                if(err){
                                    console.log(err)
                                } else {
                                    let sql = 'select count(bookid) as pends from appointment_registrar where bookStatus = "Pending"'
                                    let query = conn.query(sql,(err, countappointment)=>{
                                        if(err){
                                            console.log(err)
                                        } else {
                                            res.render('admin_dashboard-registrar', {countqueue, countsenior, countguest, countstudent, countappointment})
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
