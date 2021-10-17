const Express = require("express");
const Router = Express.Router();
const roomController = require("../controllers/room");

/** Router */
Router.post('/registerroom', roomController.registrasiRoom);
Router.put('/deleteroom', roomController.hapusRoom);

module.exports = Router;