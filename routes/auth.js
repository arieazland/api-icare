const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/auth");

/** Router */
Router.post('/login', authController.login);
Router.get('/userlist', authController.userList)
Router.post('/registeradmin', authController.registerAdmin);
Router.post('/registerpesertaevent', authController.registerPesertaevent);
Router.post('/registerpesertareguler', authController.registerPesertareguler);
Router.post('/registerkonsultan', authController.registerKonsultan);
Router.post('/registerpsikolog', authController.registerPsikolog);
Router.put('/edit', authController.edit);
Router.delete('/deleteuser', authController.deleteUser);

module.exports = Router;