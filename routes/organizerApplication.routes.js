const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const organizerApplicationController = require("../controllers/organizerApplication.controller");

router.post("/apply",authenticate,organizerApplicationController.apply);
module.exports = router;