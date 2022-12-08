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
    res.render('home')
})

module.exports = router;