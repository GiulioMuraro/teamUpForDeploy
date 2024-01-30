const mongoose= require('mongoose');

const db={};
db.mongoose= mongoose;

db.user= require("./utente");


module.exports=db;