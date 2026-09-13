const express = require("express");
const authenticate = require("../middlewares/auth.middleware.js");
const registrationController = require("../controllers/registration.controller.js");
const router = express.Router();

router.post("/:eventId/register",authenticate,registrationController.register);
router.get("/my-registrations",authenticate,registrationController.getMyRegistration)
router.patch("/:registrationId/cancel",authenticate,registrationController.cancelRegistration);


module.exports = router;