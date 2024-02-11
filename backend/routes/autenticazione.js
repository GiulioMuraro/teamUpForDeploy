const express = require('express');
const authRouter = express.Router();

const controllerUtenti = require('../controllers/controllerUtente');

// + /login := server_domain:port/auth/login
authRouter.post('/login', controllerUtenti.loginUtente);
authRouter.post('/signin', controllerUtenti.registrazioneUtente);
authRouter.post('/changepass', controllerUtenti.cambioPassword);
authRouter.post('/modifyinfo', controllerUtenti.modificaInfo);
authRouter.post('/getuserinfo', controllerUtenti.getUserInfo);
module.exports = authRouter;
