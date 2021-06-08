const Express = require("express");
const Router = Express.Router();
const authController = require("../controllers/konsul");

/** Router */
Router.post('/registerkonsul', authController.registerKonsul);
Router.put('/editkonsul', authController.editKonsul);
Router.put('/deletekonsul', authController.deleteKonsul);

module.exports = Router;