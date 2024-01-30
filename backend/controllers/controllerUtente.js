const jwt = require('jsonwebtoken');
const config = require('../config');
const Utente = require('../models/utente');
const invioEmail = require('./email');
const crypto = require('crypto');

exports.registrazioneUtente = async (req, res) => {
  const { nomeUtente, email, password, gestore } = req.body;

  if (!email || !nomeUtente || !password) {
    return res.status(400).json({ success: false, message: "Compilare tutti i campi!" });
  }

  try {
    const findUtente = await Utente.findOne({ email: email });
    if (findUtente) {
      return res.status(409).json({ success: false, message: "Utente già registrato" });
    }

    const newUtente = new Utente({
      nome: nomeUtente,
      email: email,
      password: password,
    });

    if (!gestore) {
      newUtente.ruolo = 'Utente';
    } else {
      newUtente.ruolo = 'Admin';
    }

    const nuovoUtente = await newUtente.save();
    res.status(200).json({ success: true, message: nuovoUtente });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginUtente = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Compilare tutti i campi" });
  }

  try {
    const utente = await Utente.findOne({ email: email });

    if (!utente) {
      return res.status(404).json({ success: false, message: "Utente inesistente" });
    }

    const passwordCorretta = await utente.checkPassword(password);

    if (!passwordCorretta) {
      return res.status(401).json({ success: false, message: "Password incorretta" });
    }

    const token = jwt.sign(
      {
        id: utente._id,
        nome: utente.nome,
        email: utente.email,
        ruolo: utente.ruolo,
      },
      config.SECRET_KEY,
      {
        expiresIn: "1 day",
      }
    );

    res.status(200).json({ success: true, token: token, nome: utente.nome, email: utente.email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.recuperaPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email non fornita" });
  }

  try {
    const user = await Utente.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Impossibile trovare l'email" });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.tokenRecuperoPassword = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.scadenzaRecuperoPassword = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL = `http://${config.HOST}:${config.FRONT_PORT}/resetpassword/${resetToken}`;

    const message = `
      <h1>Hai richiesto il ripristino della password</h1>
      <p>Per favore, vai a questo link per reimpostare la tua password:</p>
      <a href=${resetURL} clicktracking=off>${resetURL}`;

    try {
      await invioEmail({
        to: user.email,
        subject: 'Richiesta di ripristino password',
        text: message,
      });

      res.status(200).json({ success: true, message: 'Email inviata correttamente' });
    } catch (err) {
      user.tokenRecuperoPassword = undefined;
      user.scadenzaRecuperoPassword = undefined;
      await user.save();
      res.status(500).json({ success: false, message: err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cambioPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    res.status(400).json({ success: false, message: "Campi vuoti forniti nella richiesta" });
  }

  try {
    const userFind = await Utente.findOne({ email: email });

    if (!userFind) {
      res.status(404).json({ success: false, message: "Utente non trovato" });
    }

    const correctPassword = await userFind.checkPassword(oldPassword);

    if (!correctPassword) {
      return res.status(401).json({ success: false, message: "La vecchia password fornita è errata" });
    }

    userFind.password = newPassword;
    await userFind.save();

    res.status(200).json({ success: true, message: "Password cambiata con successo" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
