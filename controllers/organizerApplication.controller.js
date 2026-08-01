const organizerApplicationService = require("../services/organizerApplication.service.js");
// const OrganizerApplicationService = require("../services/organizerApplication.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

class OrganizerApplicationController{

    apply = asyncHandler(async (req,res) => {
        const application = await organizerApplicationService.apply(
            req.user._id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            data: application,
        });

    });

}


module.exports = new OrganizerApplicationController();