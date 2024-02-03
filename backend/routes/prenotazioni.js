const express = require('express');
const prenotazioniRouter = express.Router();

const controllerPrenotazioni = require('../controllers/controllerPrenotazioni');


prenotazioniRouter.post('/', controllerPrenotazioni.creaPrenotazione);
prenotazioniRouter.get('/', controllerPrenotazioni.fetchPrenotazione)

module.exports = prenotazioniRouter 
