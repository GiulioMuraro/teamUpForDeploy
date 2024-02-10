const express = require('express');
const segnalazioniRouter = express.Router();

const controllerSegnalazioni = require('../controllers/controllerReport');

segnalazioniRouter.post('/', controllerSegnalazioni.CreaSegnalazione);
segnalazioniRouter.post('/getsegnalazioni', controllerSegnalazioni.fetchSegnalazione);

module.exports = segnalazioniRouter