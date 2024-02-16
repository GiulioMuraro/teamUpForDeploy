const mongoose=require ('mongoose');
const utente = require('./utente');


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

schemaCampo.post('findOneAndDelete', async function (doc, next){

    try {
        // Check if doc exists
        if (!doc) {
            // Document not found, proceed to next middleware
            return next();
        }

        // Delete the bookings related to this field
        const prenotazioniToDelete = doc.prenotazioni;
        for (const prenotazioneId of prenotazioniToDelete) {
            try {
                // Find and delete the prenotazione document
                const deletedPrenotazione = await mongoose.model('prenotazione').deleteOne({ _id: prenotazioneId});
        
            } catch (error) {
                console.error(`Error deleting prenotazione with ID ${prenotazioneId}:`, error);
            }
        }

        // Delete the reference to this field in for the admin
        const output1 = await mongoose.model('utente').updateOne({ _id: doc.gestore }, { $pull: { campi: doc._id } });

        // Delete the reports for this field
        const reportsToDelete = doc.reports;
        if(reportsToDelete.length > 0){
            for (const segnalazioneId of reportsToDelete) {
                try {
                    // Find and delete the prenotazione document
                    const deletedSegnalazione = await mongoose.model('report').deleteOne({ _id: segnalazioneId});
            
                } catch (error) {
                    console.error(`Error deleting segnalazione with ID ${segnalazioneId}:`, error);
                }
            }
        }

        next();

    } catch (error) {
        console.log(error);
        next(error); // Pass any error to the next middleware
    }
})

module.exports=mongoose.model('campo',schemaCampo);