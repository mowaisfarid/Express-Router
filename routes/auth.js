var expres=require('express');
var bcrypt=require('bcrypt-inzi')
var jwt=require('jsonwebtoken')

var SERVER_SECRET=process.env.SECRET || '1234';

var {userModel}=require('../dprepo/models');
console.log('usermodel==>',userModel);

var router=expres.Router()

router.post('singup',(req,res,next)=>{
    if(
        !req.body.name
        ||!req.body.email
        ||!req.body.password
    ){ 

        res.status(403).send(`
        please send name,email,password in json body.
        eg:
        {
            "name":"xyz",
            "email":"xyz@gmail.com",
            "password":"****"
        }`)
        return;
    }


    userModel.findOne({email:req.body.email},
        function(err,doc){

            if(!err && !doc){
                bcrypt.stringToHash(req.body.password).then(function(hash){

                    var newUser= new userModel({
                        "name":req.body.name,
                        "email":req.body.email,
                        "password":hash

                    })

                    newUser.save((err,data)=>{
                        if(!err){
                            res.send({
                                message:"user created"
                            })
                        } else{
                            console.log(err);
                            res.status(500).send({
                                message:"error occured while creating user",err
                            })
                        }
                    });
                })
            }

            else if(err){
                res.status(500).send({
                    message:"db error"

                })
            }
            else{
                res.status(408).send({
                    message:"user already exist"

                })
            }
        })


});


router.post("/login",(req, res, next)=>{
    
})