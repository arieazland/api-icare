const Express = require("express");
const Router = Express.Router();
const tamuController = require("../controllers/kelolatamu");

/** Router */
Router.post('/tambah', tamuController.tambah);
Router.post('/ubah', tamuController.ubah);
Router.post('/hapus', tamuController.hapus);
Router.post('/kehadiran', tamuController.kehadiran);

module.exports = Router;