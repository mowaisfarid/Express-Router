let express=require('express');
let morgan=require('morgan');
let cors=require('cors');
let bodyParser=require('body-parser');
let cookieParser=require('cookie-parser');
let bcrypt=require('bcrypt-inzi');
let jwt=require('jsonwebtoken');
let path=require('path');

var {userModel}=require('./dprepo/models.js');
var authRoutes=require('./routes/auth');
const { nextTick } = require('process');

var SERVER_SECRET=process.env.SECRET || '1234';

var app=express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin="*",
    credentials=true
}))

app.use('/',authRoutes)
app.use(function(req,res,nex){
    console.log('req.cookies:==>',req.cookies)
    if(!req.cookies.jToken){
        res.status(401).send('include only-http credentials with every request')
        return;
    }

    jwt.verify(req.cookies.jToken,SERVER_SECRET,function(err,decodedData){

        if(!err){
            const issueDate=decodedData.iat*1000;
            const nowDate=new Date().getTime();
            const diff = nowDate-issueDate;

            if(diff >300000){
                res.status(401).send('token is expired')
            } else{
                var token=jwt.sign({
                    id:decodedData.id,
                    name:decodedData.name,
                    email:decodedData.email

                },SERVER_SECRET)

                res.cookie('jToken',token,{
                    maxAge=86_400_000,
                    httpOnly=true
                });
                req.body.jToken=decodedData
                next()
            }

        }else{
            res.status(401).send('invalid token')
        }

    })
});



app.get('/Profile',(req, res, next)=>{
    console.log(req.body);


    userModel.findByid(req.body.jToken.id,'name email createdOn',
     function(err,doc){
         if(!err){
             res.send({
                 profile:doc
             })
         }else{
             res.status(401).send({
                 message:'sever error occured'
             })
         }
     })
});


const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log('server is running on',PORT);
})
