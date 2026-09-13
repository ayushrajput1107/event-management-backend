const { response } = require("../app");
const registrationService = require("../services/registration.service");
const asyncHandler = require("../utils/asyncHandler");


class RegistrationController{


    cancelRegistration = asyncHandler(async (req,res) => {
        const registration = await registrationService.cancelRegistration(
            req.user._id,
            req.params.registrationId
        );

        return res.status(200).json({
            success: true,
            message: "Registration cancelled successfully",
            data: registration,
        });
    });



    getMyRegistration = asyncHandler(async (req,res) => {
        const  registrations = await registrationService.getMyRegistrations(req.user._id);
        return res.status(200).json({
            success: true,
            data: registrations,
        })
    })

    register = asyncHandler(async (req,res) => {

        const {ticketCount} = req.body;
        const registration = await registrationService.register(
            req.user._id,
            req.params.eventId,
            ticketCount || 1
        );

        return res.status(200).json({
            success: true,
            message: "Event registration successfull",
            data: registration,
        });

    });
}

module.exports = new RegistrationController();