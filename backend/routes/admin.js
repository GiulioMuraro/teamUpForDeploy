const express = require('express');
const adminRouter = express.Router();

const controllerAdmins = require('../controllers/controllerAdmin');

adminRouter.post('/getadminfieldsreports', controllerAdmins.getAdminFieldsReports);
adminRouter.post('/deletecampo', controllerAdmins.deleteCampo);
//adminRouter.post('/modifycampo', controllerAdmins.modifyCampo);

module.exports = adminRouter;