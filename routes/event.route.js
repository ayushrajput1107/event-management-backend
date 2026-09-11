const express = require('express');
const router = express.Router();

const authenticate = require("../middlewares/auth.middleware.js");
const authorize = require("../middlewares/authorize.middleware.js");
const eventController = require('../controllers/event.controller.js');


router.post("/",authenticate,authorize("VERIFIED_ORGANIZER"),eventController.createEvent);


module.exports = router;