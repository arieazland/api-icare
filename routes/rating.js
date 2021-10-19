const Express = require("express");
const Router = Express.Router();
const ratingController = require("../controllers/rating");

/** Router */
Router.post('/registerrating', ratingController.registrasiRating);
// Router.put('/deleteroom', ratingController.hapusRoom);

module.exports = Router;