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
    res.render("home",{ans:"", number:"", fullname: "", qstatus: "", getqdate:"", getqtime: ""})
})


router.post("/", (req,res)=>{
    var data = {name: req.body.queuename, 
        status: req.body.queuestatus,
        qdate: req.body.dates,
        qtime: req.body.times,
        qStatus: "Waiting"
        }
    var sql = 'insert into queue_registrar set ?'
    console.log(data)
    var query = conn.query(sql,data, (err,rset)=>{
        if(err){
            console.log(err)
            res.render('home')
        } else {
            var name = req.body.queuename
            var status = req.body.queuestatus 
            var qtime = req.body.times
            var qdate = req.body.dates
            var sql = "select queueNumber from queue_registrar where name = ? and qtime = ?"
            conn.query(sql,[name,qtime],(err,rset)=>{
                if (err)
                    console.log(err)
                else
                    console.log(rset)
                    res.render("home",{ans: "sQueueRegistrar", number:rset[0].queueNumber, fullname: name, qstatus: status, getqdate: qdate, getqtime: qtime})
            })
        }
    })
})



module.exports = router;