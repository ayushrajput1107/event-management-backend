const eventService = require("../services/event.service.js");
const asyncHandler = require("../utils/ApiError.js");


class EventController{

    createEvent = asyncHandler(async(req,res) => {
        const event = await eventService.createEvent(req.user._id,req.body);
        return res.status(201).json({
            success: true,
            message: "Event created successfully.",
            data: event,
        });
    });
}

module.exports = new EventController();