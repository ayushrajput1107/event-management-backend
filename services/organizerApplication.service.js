const OrganizerApplication = require("../models/organizerApplication.model.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");



class OrganizerApplicationService{

    async apply(userId, applicationData){
        const user = User.findById(userId);

        if(!user)throw new ApiError(401,"User not found!");
        if(user.authorization.role !== "ATTENDEE"){
            throw new ApiError(401,"Only attendees can apply to become organizers.")
        }

        const existingApplication = await OrganizerApplication.findOne({applicant: userId,status: {
            $in:[
                "PENDING",
                "UNDER_REVIEW",
            ],
        }});


        if(existingApplication)throw new ApiError(401,"You already have a pending Application");

        const application = await OrganizerApplication.create({
           applicant: userId,
           organization: applicationData.organization,
           eventExperience: applicationData.eventExperience,
           socialLinks: applicationData.socialLinks,
           documents: applicationData.documents,
        });


        return application;
    }

}

module.exports = new OrganizerApplicationService();