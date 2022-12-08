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
    res.render("appointment_guidance",{ans: "", number:"y", fullname:"", appstatus:"", sdate:"",
        stime:"", spurpose:"", bDate: "", bTime: ""})
})

router.post('/', (req,res)=>{
    var data = {name: req.body.name, 
                status: req.body.status,
                email: req.body.email,
                schedDate: req.body.date,
                schedTime: req.body.time,
                purpose: req.body.purpose,
                bookDate: req.body.dates,
                bookTime: req.body.times,
                bookStatus: "Pending"
                }
    var sql = 'insert into appointment_guidance set ?'
    var query = conn.query(sql, data, (err, rset)=>{
        if(err){
            console.log(err)
            res.render('appointment_guidance')
        } else {
            var name = req.body.name
            var status = req.body.status
            var schedDate = req.body.date
            var schedTime = req.body.time
            var purpose = req.body.purpose
            var bookDate = req.body.dates 
            var bookTime = req.body.times
            var sql = "select bookid, name, status, schedDate, schedTime, purpose, bookDate, bookTime from appointment_guidance where name = ? and schedDate = ? and bookDate = ?"
            conn.query(sql,[name,schedDate,bookDate],(err,rset)=>{
                if (err)
                    console.log(err)
                else
                    console.log(rset)
                    res.render("appointment_guidance",{ans: "success", number:rset[0].bookid, 
                    fullname: name, appstatus: status, sdate: schedDate, stime: schedTime,
                     spurpose: purpose, bDate: bookDate, bTime: bookTime})
            })
        }
    })
})



module.exports = router;