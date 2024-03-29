const Prenotazione = require('../models/prenotazione');
const Campo = require('../models/campo');
const Utente = require('../models/utente');

exports.creaPrenotazione = async (req, res) => {
  const { nome, data, utente, orario } = req.body;
  try {
    if (!nome || !data || !utente || !orario) {
      res.status(400).json({ success: false, message: "Compilare tutti i campi" });
      return;
    }

    const findUtente = await Utente.findOne({ email: utente.email });
    if (!findUtente) {
      res.status(404).json({ success: false, message: "Impossibile creare la prenotazione: Utente non trovato" });
      return;
    }

    const findCampo = await Campo.findOne({ nome: nome });
    if (!findCampo) {
      res.status(404).json({ success: false, message: "Impossibile creare la prenotazione: Campo non trovato" });
      return;
    }

    const nuovaPrenotazione = new Prenotazione({
      campo: findCampo,
      data: data,
      orario: orario,
      utente: findUtente
    });

    findCampo.prenotazioni.push(nuovaPrenotazione);
    findUtente.prenotazioni.push(nuovaPrenotazione);

    await findUtente.save();
    await findCampo.save();
    await nuovaPrenotazione.save();

    res.status(200).json({ success: true, message: "Nuova prenotazione creata" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Errore durante la creazione della prenotazione" });
  }
};

exports.fetchPrenotazione = async (req, res) => {
  const { utente } = req.body;
  try {
    const findUtente = await Utente.findOne({ email: utente.email }).populate({
      path: "prenotazioni",
      populate: [{ path: "campo" },
        { path: "data" },
        { path: "orario" },
      ]
    });
    if (!findUtente) {
      res.status(404).json({ success: false, message: "Utente non riconosciuto" });
    } else {
      const findPrenotazioni = findUtente.prenotazioni.map((prenotazione) => ({
        campo: {
          nome: prenotazione.campo.nome,
          posizione: prenotazione.campo.posizione
        },
        data: prenotazione.data,
        orario: prenotazione.orario,
        utente: prenotazione.utente
      
      }));

      res.status(200).json({ success: true, message: findPrenotazioni });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Errore durante il recupero delle prenotazioni: " + error });
  }
};
