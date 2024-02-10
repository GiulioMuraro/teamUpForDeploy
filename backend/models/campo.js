const mongoose=require ('mongoose');


const schemaCampo = new mongoose.Schema({
    nome:{
        type: String,
        unique: true,
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
        ref: 'prenotazione'
    },
    gestore:{
        type: mongoose.Types.ObjectId,
        ref: 'utente'
    },
    reports :{
        type: [mongoose.Types.ObjectId],
        ref: 'report'
    }
})
module.exports=mongoose.model('campo',schemaCampo);