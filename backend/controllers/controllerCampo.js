const Utente = require('../models/utente');
const Report = require('../models/report');
const Campo = require('../models/campo');
const Prenotazione = require('../models/prenotazione');

exports.inserisciCampo = async (req, res) => {
  const { nome, posizione, descrizione, gestore } = req.body;

  try {
    const findCampo = await Campo.findOne({ nome });

    if (!findCampo) {
      const findGest = await Utente.findOne({ email: gestore.email });

      if (!findGest) {
        return res.status(404).json({
          success: false,
          message: "Impossibile trovare il gestore indicato",
        });
      }

      const newCampo = new Campo({
        nome,
        posizione,
        descrizione,
        gestore: findGest,
      });

      await newCampo.save();

      res.status(200).json({ success: true, message: "Campo creato correttamente" });
    } else {
      res.status(409).json({ success: false, message: "Il campo esiste già" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Errore durante l'inserimento del campo" });
  }
};

exports.getOrariPrenotazione = async (req, res) => {
  const { nome, data } = req.body;

  try {
    const findCampo = await Campo.findOne({ nome })
      .populate({
        path: 'prenotazioni',
        match: { data },
        select: 'orario',
      });

    if (!findCampo) {
      res.status(404).json({ success: false, message: "Campo non trovato!" });
    } else {
      res.status(200).json({ success: true, findCampo });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Errore durante il recupero degli orari delle prenotazioni" });
  }
};

exports.getCampi = async (req, res) => {
  try {
    const findCampi = await Campo.find();

    if (findCampi.length === 0) {
      res.status(404).json({ success: false, message: "Nessun campo trovato!" });
    } else {
      res.status(200).json({ success: true, findCampi });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Errore durante il recupero dei campi" });
  }
};
