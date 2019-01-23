const express = require('express');

const exphbs = require('express-handlebars');

const url = require('url') ;

const bodyParser = require('body-parser');

const admin2Router = require('./my_routers/admin2');

const admin3Router = require('./my_routers/admin3');

const session = require('express-session');

const moment = require('moment-timezone');

const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test'
})
db.connect();

const app = express();

//-----------Upload files ----------------------
const multer = require('multer');
const upload = multer({dest:'tmp_uploads/'});
const fs = require('fs');

app.use(express.static('public')); // Only data in 'public' folder can show

app.use(express.static('data')); // Extra data in 'data' folder can show

app.use(bodyParser.urlencoded({extended:false})); // use bodyParser to toplevel

app.use(bodyParser.json()); // use JSON to toplevel

app.use(admin2Router); // use admin2 Way

app.use('/admin3',admin3Router); // use admin3 Way

// ------------define express-handlebars engine-------------------
app.engine('hbs',exphbs({
    defaultLayout:'main',
    extname:'.hbs',
    helpers: {list:require('./helpers/list.js')}
}));

app.set('view engine','hbs');

//------------Using Session----------------------------------------
app.use(session( { saveUninitialized:false, 
    resave:false, 
    secret:'abc@4536', 
    cookie:{
        maxAge : 60*1000 // For Logintime  1min
    } } ) );

app.get('/try-session',(req,res) => {
    req.session.views = req.session.views || 0;
    req.session.views++;
    res.send('Count:'+ req.session.views)
 });

//------------Self Define Meddileware------------------
app.use((req, res, next)=>{
    res.locals.renderData = {
        loginUser: req.session.loginUser
    };
    next();
});

//------------home page ----------------- 
app.get('/home',function (req,res) {res.render('home',
    {name:'Taiwanese!!',
    loginUser: req.session.loginUser})});


//------------Router sales page--------------------
app.get('/sales',function (req,res) {
    const sales = require('./data/sales.json')
    res.render('sales',{
        sales:sales,
        myclass:'abc',
        loginUser: req.session.loginUser})
} )

//------------Router sales2 page--------------------
app.get('/sales2',function (req,res) {
    const sales = require('./data/sales.json')
    res.render('sales2',
    {sales:sales,
    myclass:'abc',
    loginUser: req.session.loginUser})
} )

//------------Router login page--------------------
app.get('/login',function (req,res) {
    res.render('login.hbs',{login:"Welcome Guest"})
} )


//------------Router abc page--------------------
app.get('/abc',function (req,res) {
    res.send('<b>Hello ABC 2</b>');    
});

//------------Router def page--------------------
app.get('/def',function (req,res) {
    res.send(`<h2>Hello ABC 21<br>KKo90</h2>`);    
});

//------------Router form1 page--------------------
app.post('/form1.html',function (req,res) {
    res.send(`<h2>Hello Post !!</h2>`);    
});

//------------Router try-querystring page--------------------
app.get('/try-querystring', (req,res) => {
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);
    urlParts.myquery=JSON.parse(JSON.stringify(urlParts.query))
    res.render('try-querystring',{urlParts:urlParts});    
});


//------------Router try-post-form page--------------------
app.get('/try-post-form', (req,res) => { res.render('try-post-form')});

app.post('/try-post-form', (req,res) => { res.render('try-post-form',
    {email:req.body.email,
    password:req.body.password})});

//-------------Router JSON page--------------
app.post('/try-post-form2', (req,res) => { res.json(req.body)});

//-------------Upload files-------------------------------
app.get('/try-upload', (req,res) => { 
    res.render('try-upload')});

app.post('/try-upload',upload.single('avatar') ,(req,res) => { 
    console.log(req.file); // lookup files
    if(req.file && req.file.originalname){
        // If file belong to jpg jpeg png will needed
        if (/\.(jpg|jpeg|png|gif)$/i.test(req.file.originalname)) {
            fs.createReadStream(req.file.path)
            .pipe(fs.createWriteStream('./public/img/'+req.file.originalname));
        }
    }
    // res.send('OK Upload Success !!!');
    res.render('try-upload',{
        result:true,
        name: req.body.name,
        avatar:'/img/'+req.file.originalname
    });

});

//-------------Fortune Cookies---------------------------
app.get('/about', (req,res) => {
    var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    console.log(randomFortune);
    res.render('about',
    {fortune:randomFortune, 
    loginUser: req.session.loginUser})   
});

//------------Fortune Cookies Sentences------
var fortunes = [ "Conquer your fears or they will conquer you.",
                "Rivers need springs.",
                "Do not fear what you don't know.",
                "You will have a pleaseant surprise.",
                "Whenever possible, keep it simple !"];


//------------Testing Router----------------

app.get('/my-paramsl/:action/:id', (req,res) => {
    res.json(req.params);    
});

app.get('/my-params2/:action?/:id?', (req,res) => {
    res.json(req.params);    
});

//------------Testing Regular Router----------------
app.get(/^\/hi\/?/, (req,res) => {
    let result ={
        url:req.url
    };
    result.split =req.url.split('/');
    res.json(result);    
});
//------------Testing Mobile Phone ------------------------
app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}/, (req, res)=>{
    let str = req.url.slice(1);
    str = str.split('-').join('');
    res.send('Mobile : ' + str);
    });

//---------------Login & Logout--------------------------------

app.get('/login',(req,res) => {
    //----------------------
    const data = {
        logined : !! req.session.loginUser,
        loginUser : req.session.loginUser
    };
    if (req.session.flashMsg) { // Flash Message
        data.flashMsg=req.session.flashMsg;
        delete req.session.flashMsg;        
    }
    res.render('login', data);
});

app.post('/login',(req,res) => {
    if(req.body.user === 'Jerry' && req.body.password ==='1234'){
       req.session.loginUser = req.body.user;
       //res.send('Ok !!'); 
       req.session.flashMsg={
        type:'primary',
        msg:'Success !!'
        };
       console.log(req.session);
    } else { 
       // res.send('Error , not found !!') 
       //req.session.flashMsg='Error in username or password !!'
       req.session.flashMsg={
           type:'danger',
           msg:'Error in username or password !!'
       };
    }
    res.redirect('/login');
});

app.get('/logout',(req,res) => {
    delete req.session.loginUser;
    res.redirect('/login');
});

//-------------Test Timezone--------------------------------------
app.get( '/try-moment', (req,res) => {
    const myFormat = 'YYYY-MM-DD HH:mm:ss';
    const exp = req.session.cookie.expires;
    const mo1 = moment(exp);
    const mo2 = moment();
    console.log(mo1);
    res.write('Taipei Time:'+ exp+'\n');
    res.write(mo1.format(myFormat)+'\n');
    res.write(mo2.format(myFormat)+'\n');
    res.write('London Time:'+ mo1.tz('Europe/London').format(myFormat)+'\n');
    res.write('Berlin Time:'+ mo1.tz('Europe/Berlin').format(myFormat)+'\n');
    res.end(" ");
} )

//------------------Test Mysql Sales3-----------------------------------
app.get('/sales3',(req,res) => {
  const sql="SELECT * FROM sales"; // Mysql Syntax
  db.query(sql,(error,results,fields) => {
       if (error) throw error;
        
        results.forEach( (ele) => {
           ele.birthday = moment(ele.birthday).format('YYYY-MM-DD'); 
        });
       res.render('sales3',{
           sales:results, 
           loginUser: req.session.loginUser
       });
    //    console.log(results);
    //    res.send('OK, connected !!')
    })  
    });    

//-----------------Router sales3 page------------------------

app.get('/sales3/add', (req,res) => { 
    res.render('sales_add.hbs');
});

app.post('/sales3/add', (req,res) => { 
    const data =res.locals.renderData;
    const sql="INSERT INTO sales SET ? Order by DESCENDING"; // Mysql Syntax 
    const val = {
                sales_id:req.body.sales_id,
                name:req.body.name,
                birthday:req.body.birthday};
    data.addForm = val ;
    //----------------Each column have been filled-------------
    
    if (! req.body.sales_id || ! req.body.name || ! req.body.birthday){
        console.log(!req.body.sales_id || !req.body.name || !req.body.birthday);
        data.msg ={
            type:'danger',
            info:'Each columns must have been filled'
        };
        res.render('sales_add',data);
        return;
    }    

    //--------------Judge birthday format------------------
     if (! /^\d{4}\-\d{1,2}\-\d{1,2}$/.test(req.body.birthday)) {
         data.msg ={
             type:'danger',
             info:'Wrong fromat in birthday!'
         };
         res.render('sales_add.hbs',data);
         return;
     }
    db.query(sql,val, 
        (error, results, fields) => {
             if(error)
             {console.log(error)
            res.send(error,sqlMessage);
            return;
            }
        res.send(''+results.affectedRows);    
    });
    
    // res.send('ok');
});
//---------------Edit Sales3 Remove----------------------

app.get('/sales3/remove/:sid',(req,res) => {
    db.query("Delete from sales where sid=?",
    [req.params.sid],
    (error,results,fields) => 
    { res.json({success:true,
    affectedRows:results.affectedRows})})
    // (error, results, fields)=> {
    //     res.redirect('/sales3');
    // })
});


//-----------------------------------

app.get('/sales3/remove2/:sid',(req,res) => {
    db.query("Delete from sales where sid=?",
    [req.params.sid],
    (error,results,fields) => 
    { res.json({
        success:true,
        affectedRows:results.affectedRows
    })})
});

//-----------------Eidt page---------------------------------

app.get('/sales3/edit/:sid',(req,res) => {
    db.query("Select * from sales where sid=?",
    [req.params.sid],
    (error,results,fields) =>{
        // console.log(results)
        if(! results.length){
            res.status(404);
            res.send('No data!');
        } else { 
            results[0].birthday = moment(results[0].birthday).format('YYYY-MM-DD');
            // console.log(results[0]);
            res.render('sales3_edit', {
                item: results[0]
            });
        }
    });
});

//---------------Eidt page-----------------------
app.post('/sales3/edit/:sid', (req, res)=>{
        let my_result = {
            success: false,
            affectedRows: 0,
            info: '每一欄皆為必填欄位'
        };
        const val = {
            sales_id: req.body.sales_id,
            name: req.body.name,
            birthday: req.body.birthday,
        };
    
        if(!req.body.sales_id || !req.body.name || !req.body.birthday){
            res.json(my_result);
            return;
        }
        db.query("SELECT 1 FROM `sales` WHERE `sales_id`=? AND sid<>?",
            [req.body.sales_id, req.params.sid],
            (error, results, fields)=> {
                if(results.length){
                    my_result['info'] = '員工編號重複';
                    res.json(my_result);
                    return;
                }
                const sql = "UPDATE `sales` SET ? WHERE sid=?";
                db.query(sql,
                    [val, req.params.sid],
                    (error, results, fields)=>{
                        console.log(results)
                        if(error){
                            // console.log(error);
                            // res.send(error.sqlMessage);
                            // return;
                        }
                        console.log(results)
                        if(results.changedRows===1){
             
                            my_result = {
                                success: true,
                                affectedRows: 1,
                                info: '修改成功'
                            };
                            res.json(my_result);
                        } else {
                            my_result['info'] = '資料沒有變更';
                            res.json(my_result);
                        }
                    });
            });
    });


//-------------When you not found Page----------------
app.use( (req,res) => {
    res.type('text/html');
    res.status(404);
    res.send(`<h2>Sorry</h2><img src='404.png'><h2>The page we can't found ....</h2>`);
} );

//------------When you start Sever---------------------------
app.listen(3000,function () {
    console.log('Server Start & Listen port 3000')
});