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
    res.render("login", {ans: "",msg:""})
})

router.post("/", (req,res)=>{
    var username = req.body.uname
    var passw = req.body.psw
    var sql = "select * from admin where username = ?"
    var query = conn.query(sql, username, (err, rset)=>{
        if(err){
            console.log(err)
        } else {
            if(rset.length==0)                                                  
                res.render('login', {
                msg: 'Incorrect username', ans: 'v'
            })                                        
            else {                                                                      
                if (String(passw).localeCompare(String(rset[0].password))==0){        
                    var username = req.body.uname
                    var sql = "select * from admin where username = ?"
                    var query = conn.query(sql, username, (err, rset)=>{
                        if (rset[0].adminid==1)
                            res.redirect('/admin-cashier') 
                        else if (rset[0].adminid==2)
                            res.redirect('/admin-guidance') 
                        else if (rset[0].adminid==3)
                            res.redirect('/admin-registrar') 
                    })                               
                }else{                                                                  
                    res.render('login', {
                    msg: 'Access denied', ans: 'v' 
                })}
            }  
        }
    })
})

module.exports = router;