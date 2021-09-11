const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/auth");

/** Router */
Router.post('/login', authController.login);
Router.post('/registeradmin', authController.registerAdmin);
Router.post('/registerpeserta', authController.registerPeserta);
Router.post('/registerpesertaevent', authController.registerPesertaevent);
Router.post('/registerpesertareguler', authController.registerPesertareguler);
Router.post('/registerkonsultan', authController.registerKonsultan);
Router.post('/registerpsikolog', authController.registerPsikolog);
Router.put('/edituser', authController.edit);
Router.put('/deleteuser', authController.delete);
Router.put('/gantipassword', authController.gantiPassword);

module.exports = Router;