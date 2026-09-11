const Event = require("../models/event.model.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");

class EventService{

    async createEvent(userId, eventData){
        const user = await User.findById(userId);

        if(!user){
            throw new ApiError(404, "User not found!");
        }


        if(user.authorization.role !== "VERIFIED_ORGANIZER"){
            throw new ApiError(403,"Only verified Organizers can create events.")
        }


        const totalSeats = eventData.capacity.totalSeats;

        const event = await Event.create({
            basicInfo: eventData.basicInfo,
            organizer: userId,
            schedule: eventData.schedule,
            venue: eventData.venue,

            capacity: {
                totalSeats: totalSeats,
                availableSeats: totalSeats,
        
            },

            registration: eventData.registration || {},
            policy: eventData.policy || {},
            analytics: eventData.analytics || {},

            status: "DRAFT",
        });

        return event;
         
    }

}

module.exports = new EventService();