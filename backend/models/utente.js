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
    reports:{   // Reports filed from the users
        type: [mongoose.Types.ObjectId],
        ref: 'report'
    },
    tokenRecuperoPassword: String,
    scadenzaRecuperoPassword: String
})
schemaUtente.pre('save', async function (next){
    
    if (!this.isModified('password')) {
        next(); // If password is not modified, move to the next middleware
        return;
    }
    
    try {
        // Hash the password
        this.password = await bcrypt.hash(this.password, 10);
        next(); // Call next to proceed to the next middleware
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
})

schemaUtente.methods.checkPassword= async function( password){
    let val=await bcrypt.compare(password, this.password)
    return val; 
}

module.exports=mongoose.model('utente',schemaUtente);