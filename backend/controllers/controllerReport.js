const Segnalazione = require("../models/report")
const Prenotazione = require("../models/prenotazione")
const Utente = require("../models/utente")
const Campo = require("../models/campo")

exports.CreaSegnalazione = async (req, res) => {
    const { description, utente, prenotazione, campo } = req.body;
    try {
        if (!description || !utente || !prenotazione || !campo) {
            res.status(400).json({ success: false, message: "Compilare tutti i campi" });
            return;
        }

        // Check if the user is existing in the DB
        const findUtente = await Utente.findOne({ email: utente.email });
        if (!findUtente) {
            res.status(404).json({ success: false, message: "Impossibile creare la segnalazione: Utente non trovato" });
            return;
        }

        // Check if the field is existing in the DB
        const findCampo = await Campo.findOne({ nome: campo.nome });
        if (!findCampo) {
            res.status(404).json({ success: false, message: "Impossibile creare la segnalazione: Campo non trovato" });
            return;
        }

        //Check if the booking is existing in the DB
        const findBooking = await Prenotazione.findOne({ campo: findCampo, data: prenotazione.data, orario: prenotazione.orario , utente: findUtente });
        if (!findBooking) {
            res.status(404).json({ success: false, message: "Impossibile creare la segnalazione: Prenotazione non trovata" });
            return;
        }

        const nuovaSegnalazione = new Segnalazione({
            description: description,
            utente: findUtente,
            prenotazione: findBooking,
            campo: findCampo
        });

        findUtente.reports.push(nuovaSegnalazione);
        findCampo.reports.push(nuovaSegnalazione);

        await findUtente.save();
        await findCampo.save();
        await nuovaSegnalazione.save();

        res.status(200).json({ success: true, message: "Nuova segnalazione creata" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Errore durante la creazione della segnalazione" });
    }
}

exports.fetchSegnalazione = async (req, res) => {
    const { utente } = req.body;
  
    try {
        const findUtente = await Utente.findOne({ email: utente.email }).populate({
            path:  "reports",
            populate: [
                { path: "utente", select: "email"},
                { path: "prenotazione", select: "campo data orario utente"},
                { path: "campo", select: "nome"},
            ],
        });
  
        if (!findUtente) {
            res.status(404).json({ success: false, message: "Utente non riconosciuto" });
        }
        else {
            const findSegnalazione = findUtente.reports.map((segnalazione) => ({
                utente: segnalazione.utente.username,
                campo: segnalazione.campo.nome,
                data: segnalazione.prenotazione.data,
                orario: segnalazione.prenotazione.orario,
                descrizione: segnalazione.description,
            }));
    
            res.status(200).json({ success: true, findSegnalazione });
        }
    } catch (error) {
      res.status(500).json({ success: false, message: "Errore durante il recupero delle segnalazioni" });
    }
};
  