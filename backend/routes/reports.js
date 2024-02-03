const express = require('express');
const segnalazioniRouter = express.Router();

const controllerSegnalazioni = require('../controllers/controllerReport');

segnalazioniRouter.post('/', controllerSegnalazioni.CreaSegnalazione);
segnalazioniRouter.get('/', controllerSegnalazioni.fetchSegnalazione);

module.exports = segnalazioniRouter