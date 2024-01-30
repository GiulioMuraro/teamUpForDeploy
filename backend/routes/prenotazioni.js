const express = require('express');
const prenotazioniRouter = express.Router();

const controllerPrenotazioni = require('../controllers/controllerPrenotazioni');

// middleware > 
prenotazioniRouter.post('/', controllerPrenotazioni.creaPrenotazione);
prenotazioniRouter.post('/getprenotazioni', controllerPrenotazioni.fetchPrenotazione)

module.exports = prenotazioniRouter
