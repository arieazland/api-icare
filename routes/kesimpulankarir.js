const Express = require("express");
const Router = Express.Router();
const kesimpulankarirController = require("../controllers/kesimpulankarir");

/** Router */
Router.post('/registerkesimpulan', kesimpulankarirController.registerKesimpulan);
Router.put('/editkesimpulan', kesimpulankarirController.editKesimpulan);
Router.put('/deletekesimpulan', kesimpulankarirController.deleteKesimpulan);

module.exports = Router;