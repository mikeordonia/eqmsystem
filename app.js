const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = process.env.PORT || 3000

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

conn.connect((err)=>{
    if(err)
        console.log(err)
    else
        console.log('Database connected')
})

const homeRoute = require('./routes/home')
app.use('/', homeRoute)

//login/
const loginRoute = require('./routes/login')
app.use('/login', loginRoute)


//Appointments//
const appCashierRoute = require('./routes/appointment/a_cashier')
app.use('/appointment_cashier', appCashierRoute)

const appGuidanceRoute = require('./routes/appointment/a_guidance')
app.use('/appointment_guidance', appGuidanceRoute)

const appRegistrarRoute = require('./routes/appointment/a_registrar')
app.use('/appointment_registrar', appRegistrarRoute)

//Queues//
const queueCashierRoute = require('./routes/queue/q_cashier')
app.use('/queue_cashier', queueCashierRoute)

const queueGuidanceRoute = require('./routes/queue/q_guidance')
app.use('/queue_guidance', queueGuidanceRoute)

const queueRegistarRoute = require('./routes/queue/q_registrar')
app.use('/queue_registrar', queueRegistarRoute)


//ADMIN Cashier//
    //admin dashboard//
    const adminCashier = require('./routes/admin-cashier/dashboard-cashier')
    app.use('/admin-cashier', adminCashier)

    //Appointment list//
    app.get("/admin-appointment-cashier", (req,res)=>{
        let sql = 'select * from appointment_cashier where bookStatus = "Pending"'
        let query = conn.query(sql,(err, rset1)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from appointment_cashier where bookStatus = "Done"'
                let query = conn.query(sql,(err, rset2)=>{
                    if(err){
                    console.log(err)
                } else {
                    res.render('admin_app-cashier', {rset1,rset2, ans: ""})
                }
                })
            }
        })
    })

        //appointment update//
        app.get('/done-cashier/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_cashier set bookStatus = "Done" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-cashier')
                }
            })
        })
        app.get('/appointment-pending-cashier/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_cashier set bookStatus = "Pending" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-cashier')
                }
            })
        })
        app.get('/delete-appointment-cashier/:bookid', (req,res)=>{
            const id = req.params.bookid
            let sql = 'delete from appointment_cashier where bookid = ?'
            let query = conn.query(sql, id, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    let sql = 'select * from appointment_cashier where bookStatus = "Pending"'
                    let query = conn.query(sql,(err, rset1)=>{
                        if(err){
                            console.log(err)
                        } else {
                            let sql = 'select * from appointment_cashier where bookStatus = "Done"'
                            let query = conn.query(sql,(err, rset2)=>{
                                if(err){
                                console.log(err)
                                } else {
                                    res.render('admin_app-cashier', {rset, rset1, rset2, ans: 'd'})
                                }
                            })
                        }
                    })
                }
            })
        })
    
    //Queue list//
    const adminQueueCashierRoute = require('./routes/admin-cashier/queue-list_cashier')
    app.use('/admin-queue-cashier', adminQueueCashierRoute)

    //Monitoring Queue//
    app.get('/served-cashier/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_cashier set qStatus = "Served" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_cashier where queueNumber = ?'
                let query = conn.query(sql, queueNumber, (err, rset)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_cashier where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                        let query = conn.query(sql,(err, rset1)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_cashier where qStatus = "Waiting" and status = "Senior/Pwd"'
                                let query = conn.query(sql,(err, rset2)=>{
                                    if(err){
                                    console.log(err)
                                    } else {
                                        let sql = 'select * from queue_cashier where qStatus = "Pending"'
                                        let query = conn.query(sql,(err, rset3)=>{
                                            if(err){
                                            console.log(err)
                                            } else {
                                                res.render('admin-monitor-queue-cashier', {rset,rset1,rset2,rset3})
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

    //Await Queue Cashier//
    app.get('/pending-cashier/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_cashier set qStatus = "Pending" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                res.redirect('/admin-queue-cashier')
            }
        })
    })

    //Delete queue//
    app.get('/delete-queue', (req,res)=>{
        let deleteall = 'DELETE FROM queue_cashier WHERE queueNumber NOT IN ( 0 )'
        let resetautoincrement = 'ALTER TABLE queue_cashier AUTO_INCREMENT = 1'
        let query = conn.query(deleteall, resetautoincrement, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_cashier where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                let query = conn.query(sql,(err, rset1)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_cashier where qStatus = "Waiting" and status = "Senior/Pwd"'
                        let query = conn.query(sql,(err, rset2)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_cashier where qStatus = "Pending"'
                                let query = conn.query(sql,(err, rset3)=>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                        res.render('admin_queue-cashier', {rset1,rset2,rset3})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    //view queue Cashier//
    app.get('/view-queue-cashier', (req,res)=>{
        let sql = 'select queueNumber, name from queue_cashier where qstatus = "Served" order by latestUpdated DESC;'
        let query = conn.query(sql, (err, rset)=>{
            if(err){
                console.log(err)
            } else{
                let sql = 'select * from queue_cashier where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                let query = conn.query(sql,(err, rset1)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_cashier where qStatus = "Waiting" and status = "Senior/Pwd"'
                        let query = conn.query(sql,(err, rset2)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_cashier where qStatus = "Pending"'
                                let query = conn.query(sql,(err, rset3)=>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                        res.render('view_queue-cashier', {rset,rset1,rset2,rset3})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    //end Admin Cashier


//ADMIN Guidance//
    //admin dashboard//
    const adminGuidance = require('./routes/admin-guidance/dashboard-guidance')
    app.use('/admin-guidance', adminGuidance)

    //Appointment list//
    app.get("/admin-appointment-guidance", (req,res)=>{
        let sql = 'select * from appointment_guidance where bookStatus = "Pending"'
        let query = conn.query(sql,(err, rset1)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from appointment_guidance where bookStatus = "Done"'
                let query = conn.query(sql,(err, rset2)=>{
                    if(err){
                    console.log(err)
                } else {
                    res.render('admin_app-guidance', {rset1,rset2, ans: ""})
                }
                })
            }
        })
    })

        //appointment update//
        app.get('/done-guidance/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_guidance set bookStatus = "Done" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-guidance')
                }
            })
        })
        app.get('/appointment-pending-guidance/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_guidance set bookStatus = "Pending" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-guidance')
                }
            })
        })
        app.get('/delete-appointment-guidance/:bookid', (req,res)=>{
            const id = req.params.bookid
            let sql = 'delete from appointment_guidance where bookid = ?'
            let query = conn.query(sql, id, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    let sql = 'select * from appointment_guidance where bookStatus = "Pending"'
                    let query = conn.query(sql,(err, rset1)=>{
                        if(err){
                            console.log(err)
                        } else {
                            let sql = 'select * from appointment_guidance where bookStatus = "Done"'
                            let query = conn.query(sql,(err, rset2)=>{
                                if(err){
                                console.log(err)
                                } else {
                                    res.render('admin_app-guidance', {rset, rset1,rset2, ans: 'd'})
                                }
                            })
                        }
                    })
                }
            })
        })
    
    //Queue list//
    const adminQueueGuidanceRoute = require('./routes/admin-guidance/queue-list_guidance')
    app.use('/admin-queue-guidance', adminQueueGuidanceRoute)

    //Monitoring Queue//
    app.get('/served-guidance/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_guidance set qStatus = "Served" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_guidance where queueNumber = ?'
                let query = conn.query(sql, queueNumber, (err, rset)=>{
                    if(err){
                        console.log(err)
                    } else {
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
                                                res.render('admin-monitor-queue-guidance', {rset,rset1,rset2,rset3})
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

    //Await Queue Regirstrar//
    app.get('/pending-guidance/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_guidance set qStatus = "Pending" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                res.redirect('/admin-queue-guidance')
            }
        })
    })

    //Delete queue//
    app.get('/delete-queue', (req,res)=>{
        let deleteall = 'DELETE FROM queue_guidance WHERE queueNumber NOT IN ( 0 )'
        let resetautoincrement = 'ALTER TABLE queue_guidance AUTO_INCREMENT = 1'
        let query = conn.query(deleteall, resetautoincrement, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
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
            }
        })
    })

    //view queue guidance//
    app.get('/view-queue-guidance', (req,res)=>{
        let sql = 'select queueNumber, name from queue_guidance where qstatus = "Served" order by latestUpdated DESC;'
        let query = conn.query(sql, (err, rset)=>{
            if(err){
                console.log(err)
            } else{
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
                                        res.render('view_queue-guidance', {rset,rset1,rset2,rset3})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    //end Admin Guidance


//ADMIN Registrar//
    //admin dashboard//
    const adminRegistrar = require('./routes/admin-registrar/dashboard-registrar')
    app.use('/admin-registrar', adminRegistrar)

    //Appointment list//
    app.get("/admin-appointment-registrar", (req,res)=>{
        let sql = 'select * from appointment_registrar where bookStatus = "Pending"'
        let query = conn.query(sql,(err, rset1)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from appointment_registrar where bookStatus = "Done"'
                let query = conn.query(sql,(err, rset2)=>{
                    if(err){
                    console.log(err)
                } else {
                    res.render('admin_app-registrar', {rset1,rset2, ans: ""})
                }
                })
            }
        })
    })

        //appointment update//
        app.get('/done-registrar/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_registrar set bookStatus = "Done" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-registrar')
                }
            })
        })
        app.get('/appointment-pending-registrar/:bookid', (req,res)=>{
            const bookid = req.params.bookid
            let sql = 'update appointment_registrar set bookStatus = "Pending" where bookid = ?'
            let query = conn.query(sql, bookid, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    res.redirect('/admin-appointment-registrar')
                }
            })
        })
        app.get('/delete-appointment-registrar/:bookid', (req,res)=>{
            const id = req.params.bookid
            let sql = 'delete from appointment_registrar where bookid = ?'
            let query = conn.query(sql, id, (err, rset)=>{
                if(err){
                    console.log(err)
                } else {
                    let sql = 'select * from appointment_registrar where bookStatus = "Pending"'
                    let query = conn.query(sql,(err, rset1)=>{
                        if(err){
                            console.log(err)
                        } else {
                            let sql = 'select * from appointment_registrar where bookStatus = "Done"'
                            let query = conn.query(sql,(err, rset2)=>{
                                if(err){
                                console.log(err)
                                } else {
                                    res.render('admin_app-registrar', {rset, rset1,rset2, ans: 'd'})
                                }
                            })
                        }
                    })
                }
            })
        })
    
    //Queue list//
    const adminQueueRegistrarRoute = require('./routes/admin-registrar/queue-list_registrar')
    app.use('/admin-queue-registrar', adminQueueRegistrarRoute)

    //Monitoring Queue//
    app.get('/served-registrar/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_registrar set qStatus = "Served" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_registrar where queueNumber = ?'
                let query = conn.query(sql, queueNumber, (err, rset)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_registrar where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                        let query = conn.query(sql,(err, rset1)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_registrar where qStatus = "Waiting" and status = "Senior/Pwd"'
                                let query = conn.query(sql,(err, rset2)=>{
                                    if(err){
                                    console.log(err)
                                    } else {
                                        let sql = 'select * from queue_registrar where qStatus = "Pending"'
                                        let query = conn.query(sql,(err, rset3)=>{
                                            if(err){
                                            console.log(err)
                                            } else {
                                                res.render('admin-monitor-queue-registrar', {rset,rset1,rset2,rset3})
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

    //Await Queue Regirstrar//
    app.get('/pending-registrar/:queueNumber', (req,res)=>{
        const queueNumber = req.params.queueNumber
        let sql = 'update queue_registrar set qStatus = "Pending" where queueNumber = ?'
        let query = conn.query(sql, queueNumber, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                res.redirect('/admin-queue-registrar')
            }
        })
    })

    //Delete queue//
    app.get('/delete-queue', (req,res)=>{
        let deleteall = 'DELETE FROM queue_registrar WHERE queueNumber NOT IN ( 0 )'
        let resetautoincrement = 'ALTER TABLE queue_registrar AUTO_INCREMENT = 1'
        let defaultqueue = 'INSERT INTO queue_registrar ("queueNumber", "name", "status", "qdate", "qtime", "qstatus", "latestUpdated") VALUES (NULL, "---", "", "", "", "", current_timestamp());'
        let query = conn.query(deleteall, resetautoincrement, defaultqueue, (err, rset)=>{
            if(err){
                console.log(err)
            } else {
                let sql = 'select * from queue_registrar where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                let query = conn.query(sql,(err, rset1)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_registrar where qStatus = "Waiting" and status = "Senior/Pwd"'
                        let query = conn.query(sql,(err, rset2)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_registrar where qStatus = "Pending"'
                                let query = conn.query(sql,(err, rset3)=>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                        res.render('admin_queue-registrar', {rset1,rset2,rset3})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    //view queue registrar//
    app.get('/view-queue-registrar', (req,res)=>{
        let sql = 'select queueNumber, name from queue_registrar where qstatus = "Served" order by latestUpdated DESC;'
        let query = conn.query(sql, (err, rset)=>{
            if(err){
                console.log(err)
            } else{
                let sql = 'select * from queue_registrar where qStatus = "Waiting" and (status = "Student" OR status = "Guest")'
                let query = conn.query(sql,(err, rset1)=>{
                    if(err){
                        console.log(err)
                    } else {
                        let sql = 'select * from queue_registrar where qStatus = "Waiting" and status = "Senior/Pwd"'
                        let query = conn.query(sql,(err, rset2)=>{
                            if(err){
                                console.log(err)
                            } else {
                                let sql = 'select * from queue_registrar where qStatus = "Pending"'
                                let query = conn.query(sql,(err, rset3)=>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                        res.render('view_queue-registrar', {rset,rset1,rset2,rset3})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    /// end Admin Registrar///


app.listen(port, ()=>{
    console.log("Server is running...")
})