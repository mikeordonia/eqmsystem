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
    res.render("home",{ans:"", number:"", fullname: "", qstatus: "", getqdate:"", getqtime: ""})
})


router.post("/", (req,res)=>{
    var data = {name: req.body.queuename, 
        status: req.body.queuestatus,
        qdate: req.body.dates,
        qtime: req.body.times,
        qStatus: "Waiting"
        }
    var sql = 'insert into queue_guidance set ?'
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
            var sql = "select queueNumber from queue_guidance where name = ? and qtime = ?"
            conn.query(sql,[name,qtime],(err,rset)=>{
                if (err)
                    console.log(err)
                else
                    console.log(rset)
                    res.render("home",{ans: "sQueueGuidance", number:rset[0].queueNumber, fullname: name, qstatus: status, getqdate: qdate, getqtime: qtime})
            })
        }
    })
})



module.exports = router;
