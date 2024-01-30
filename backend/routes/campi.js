const express= require ('express');
const campiRouter = express.Router();

const controllerCampo = require('../controllers/controllerCampo')

campiRouter.post('/addcampo',controllerCampo.inserisciCampo);
campiRouter.post('/getorari', controllerCampo.getOrariPrenotazione);
campiRouter.get('/getcampi', controllerCampo.getCampi);

module.exports = campiRouter;