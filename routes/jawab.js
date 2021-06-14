const Express = require("express");
const Router = Express.Router();
const jawabController = require("../controllers/jawab");

/** Router */
Router.post('/registerjawab', jawabController.registerJawab);
Router.post('/registerjawabmultiple', jawabController.registerJawabmultiple);
Router.put('/editjawab', jawabController.editJawab);
Router.put('/deletejawab', jawabController.deleteJawab);

module.exports = Router;