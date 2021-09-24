const Express = require("express");
const Router = Express.Router();
const kesimpulankepribadianController = require("../controllers/kesimpulankepribadian");

/** Router */
Router.post('/registerkesimpulan', kesimpulankepribadianController.registerKesimpulan);
Router.put('/editkesimpulan', kesimpulankepribadianController.editKesimpulan);
Router.put('/deletekesimpulan', kesimpulankepribadianController.deleteKesimpulan);

module.exports = Router;