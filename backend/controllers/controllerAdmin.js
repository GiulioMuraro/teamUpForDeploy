const config = require('../config');
const Utente = require('../models/utente');
const Campo = require('../models/campo');

exports.getAdminFieldsReports = async (req, res) => {
    const { email } = req.body;
  
    try{
      const findAdmin = await Utente.findOne({ email: email });
      if(!findAdmin){
        return res.status(404).json({ success: false, message: "Admin non trovato"});
      }
  
      // Checking if the user found is in fact an admin
      if(findAdmin.ruolo == 'Utente'){
        return res.status(409).json({ success: false, message: "L'utente trovato non ha dei privilegi da amministratore"});
      }
  
      // If the user is an admin, continue with the fetching of the fields
      const findCampi = await Campo.find({ gestore: findAdmin }).populate({
        path: 'reports',
        model: 'report',
        populate: {
        path: 'utente prenotazione campo',
        model: 'utente prenotazione campo'
      }
      });
  
      res.status(200).json({ success: true, message: findCampi });
  
    }catch(error){
      res.status(500).json({ success: false, message: "Errore nell'estrazione dei dati admin: " + error});
    }
  };

  exports.deleteCampo = async (req, res) => {
    const { nome } = req.body;

    try{
        const findCampo = await Campo.findOneAndDelete({nome: nome});
        if(!findCampo){
            return res.status(404).json({ success: false, message: "Campo da eliminare non trovato" });
        }
  
        res.status(200).json({ success: true, message: "Campo eliminato correttamente" });
  
    }catch(error){
      res.status(500).json({ success: false, message: "Errore nell'eliminazione del campo: " + error});
    }
  };

  /*exports.modifyCampo = async (req, res) => {
    const {  } = req.body;
  
    try{
      
  
      res.status(200).json({ success: true, message: "" });
  
    }catch(error){
      res.status(500).json({ success: false, message: "Errore nella modifica del campo: " + error});
    }
  }*/