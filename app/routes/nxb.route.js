const express = require("express");
const nxbs = require("../controllers/published.controller");

const router = express.Router();

router.route("/").get(nxbs.findAll).post(nxbs.create).delete(nxbs.deleteAll);

router.route("/maNxb").get(nxbs.findOneMaNxb);

router.route("/:id").get(nxbs.findOne).put(nxbs.update).delete(nxbs.delete);

module.exports = router;
