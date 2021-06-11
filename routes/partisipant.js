const Express = require("express");
const Router = Express.Router();
const partisipantController = require("../controllers/partisipant");

/** Router */
Router.post('/registerpartisipant', partisipantController.registerPartisipant);
Router.delete('/deletepartisipant', partisipantController.deletePartisipant);

module.exports = Router;