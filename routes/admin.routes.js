const express = require("express");
const authenticate = require("../middlewares/auth.middleware.js");
const authorize = require("../middlewares/authorize.middleware.js");
const organizerApplicationController = require("../controllers/organizerApplication.controller.js");
const router = express.Router();



router.get("/organizer-applications",authenticate,authorize("ADMIN"),organizerApplicationController.getMyApplication);

router.patch("/organizer-applications/:applicationId/approve",authenticate,authorize("ADMIN"),organizerApplicationController.approveApplication);
router.patch("/organizer-applications/:applicationId/reject",authenticate,authorize("ADMIN"),organizerApplicationController.rejectApplication);


module.exports = router;