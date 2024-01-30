const mongoose=require ('mongoose');


const schemaCampo = new mongoose.Schema({
    nome:{
        type: String,
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
    report :{
        type: [mongoose.Types.ObjectId],
        ref: 'report'
    }
})
module.exports=mongoose.model('campo',schemaCampo);