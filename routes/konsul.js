const Express = require("express");
const Router = Express.Router();
const konsulController = require("../controllers/konsul");

/** Router */
Router.post('/registerkonsul', konsulController.registerKonsul);
Router.put('/editkonsul', konsulController.editKonsul);
Router.put('/deletekonsul', konsulController.deleteKonsul);

module.exports = Router;