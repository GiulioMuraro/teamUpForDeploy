const mongoose= require ('mongoose');
const bcrypt= require ('bcryptjs');

const reportSchema= new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    utente:{
        type : mongoose.Types.ObjectId,
        ref: 'utente',
        required: true
    },
    prenotazione:{
        type : mongoose.Types.ObjectId,
        ref: 'prenotazione',
        require: true
    },
    campo:{
        type:  mongoose.Types.ObjectId,
        ref: 'campo',
        require: true
    }
})

module.exports= mongoose.model('report',reportSchema);