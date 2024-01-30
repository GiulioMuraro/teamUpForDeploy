const mongoose= require ('mongoose');
const bcrypt= require ('bcryptjs');

const prenotazioneSchema = new mongoose.Schema({
    campo:{
        type: mongoose.Types.ObjectId,
        ref : 'campo'
    },
    data:{
        type: String,
        required: true
    },
    orario:{
        type: String,
        required: true
    },
    utente:{
        type: mongoose.Types.ObjectId,
        ref: 'utente'
    },
    report:{
        type: mongoose.Types.ObjectId,
        ref: 'report'
    }
})
//nome o Utente reference?
module.exports= mongoose.model('prenotazione',prenotazioneSchema);