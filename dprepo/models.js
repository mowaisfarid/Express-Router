var mongoose= require ("mongoose");
const { stringify } = require("querystring");
var dbURI="";


mongoose.connection.on('connected',function(){
    console.log('mongoose is connected');

})

mongoose.connection.on('disconnected',function(){
    console.log('mongoose is disconnected');
    process.exit(1)

})

mongoose.connection.on('error',function(err){
    console.log('mongoose connection error==>',err);
})

process.on('SIGINT',function(){
    console.log('app is terminating');

    mongoose.connection.close(function(){
        console.log('mongoose default connection closed');
        process.env(0)
    })
});

var userSchema= new mongoose.Schema({
    "name":String,
    "email":String,
    "password":String,
    "createdOn":{"type":Date, "default":Date.now},
    "activeSince":Date
});

var userModel=mongoose.model("users",userSchema)


module.exports={
    userModel:userModel
}