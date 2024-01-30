const jwt= require('jsonwebtoken');
const config= require('../config');

module.exports= (req, res, next)=>{
    try{
        const bearerToken=req.headers['authorization']
        if(!bearerToken){
            return res.status(401).json({succes: false, message: "utente non loggato!"})
        }

        const token= bearerToken.split(" ") [1];
        const decode= jwt.verify(token,config.SECRET_KEY);

        req.userData=decode;

        next();
    }catch(err){
        res.status(500).json({success:false, message:err})
    }
}