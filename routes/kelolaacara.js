const Express = require("express");
const Router = Express.Router();
const acaraController = require("../controllers/kelolaacara");

/** Router */
Router.post('/tambah', acaraController.tambah);
Router.post('/ubah', acaraController.ubah);
Router.post('/hapus', acaraController.hapus);

module.exports = Router;