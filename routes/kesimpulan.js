const Express = require("express");
const Router = Express.Router();
const kesimpulanController = require("../controllers/kesimpulan");

/** Router */
Router.post('/registerkesimpulan', kesimpulanController.registerKesimpulan);
Router.put('/editkesimpulan', kesimpulanController.editKesimpulan);
Router.put('/deletekesimpulan', kesimpulanController.deleteKesimpulan);

module.exports = Router;