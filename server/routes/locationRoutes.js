const router = require("express").Router();
const { resolveLocation } = require("../controllers/locationController");

router.post("/resolve", resolveLocation);

module.exports = router;
