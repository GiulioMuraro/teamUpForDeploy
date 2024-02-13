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

prenotazioneSchema.pre('deleteOne', async function (next) {
    try {
        // Capture the document before deletion
        this._docToDelete = await this.model.findOne(this.getFilter());
        next();
    } catch (error) {
        next(error);
    }
});

prenotazioneSchema.post('deleteOne', async function (next){
    try {
        // Access the captured document
        const docToDelete = this._docToDelete;

        console.log("PRE prenotazione");
        // Delete the reference to this booking for the user
        const output = await mongoose.model('utente').updateOne({ _id: docToDelete.utente }, { $pull: { prenotazioni: docToDelete._id } });

        // Delete the reference to this booking for the report
        const reportToDelete = docToDelete.report;
        await mongoose.model('report').deleteOne({ _id: docToDelete.reportToDelete });

        next(); // Call next to proceed to the next middleware
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
})

//nome o Utente reference?
module.exports= mongoose.model('prenotazione',prenotazioneSchema);