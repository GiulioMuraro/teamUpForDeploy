const mongoose=require ('mongoose');


const schemaCampo = new mongoose.Schema({
    nome:{
        type: String,
        unique,
        required: true
    },
    posizione:{
        type: String,
        required: true
    },
    descrizione:{
        type: String,
        ref: 'descrizione'
    },
    prenotazioni:{
        type: [mongoose.Types.ObjectId],
        ref: 'prenotazioni'
    },
    gestore:{
        type: mongoose.Types.ObjectId,
        ref: 'utente'
    },
    reports :{
        type: [mongoose.Types.ObjectId],
        ref: 'reports'
    }
})
module.exports=mongoose.model('campo',schemaCampo);