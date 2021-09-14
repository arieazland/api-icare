const Express = require("express");
const Router = Express.Router();
const assessmentController = require("../controllers/assessment");

/** Router */
Router.post('/registrasijawaban', assessmentController.registrasiJawaban);
module.exports = Router;