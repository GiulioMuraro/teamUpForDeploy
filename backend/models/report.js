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

reportSchema.pre('deleteOne', async function (next) {
    try {
        // Capture the document before deletion
        this._docToDelete = await this.model.findOne(this.getFilter());
        next();
    } catch (error) {
        next(error);
    }
});

reportSchema.post('deleteOne', async function (doc, next){
    
    try {
        // Access the captured document
        const docToDelete = this._docToDelete;
        console.log("Salve: " + docToDelete);

        // Check if the user is still existing
        if(docToDelete.utente){
            // Delete the reference to this report from the user document
            await mongoose.model('utente').updateOne({ _id: docToDelete.utente }, { $pull: { reports: docToDelete._id } });
        }

        // Delete the reference to this report from the field document
        await mongoose.model('campo').updateOne({ _id: docToDelete.campo }, { $pull: { reports: docToDelete._id } });

        next(); // Call next to proceed to the next middleware
    } catch (error) {
        next(error); // Pass any error to the next middleware
    }
})

module.exports= mongoose.model('report',reportSchema);