const mongoose= require ('mongoose');
const bcrypt= require ('bcryptjs');

const schemaUtente = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        // regex per controllo email valida
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password:{
        type: String,
        required: true
    },
    ruolo:{
        type: String,
        enum: ['Utente','Admin'],
        required: true
    },
    prenotazioni:{
        type: [mongoose.Types.ObjectId],
        ref: 'prenotazione'
    },
    campi:{//nel caso di un admin vengono salvati nel documento anche la lista di campi
        type:[mongoose.Types.ObjectId],
        ref:'campo'
    },
    tokenRecuperoPassword: String,
    scadenzaRecuperoPassword: String
})
schemaUtente.pre('save', async function (next){
    
    if(!this.isModified('password'))
        next()
    
    this.password=await bcrypt.hash(this.password,10)
    console.log(this.password)
        next()
})

schemaUtente.methods.checkPassword= async function( password){
    let val=await bcrypt.compare(password, this.password)
    console.log(val);
    return val; 
}

module.exports=mongoose.model('utente',schemaUtente);