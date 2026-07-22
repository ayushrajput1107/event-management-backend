const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");

class AuthService{
    async register(userData){
        const{
            firstName,
            lastName,
            email,
            password
        } = userData;

        const existingUser = await User.findOne({
            "auth.email": email
        });

        if(existingUser){
            throw new ApiError(409,"Email already registered.");
        }

        const user = await User.create({
            profile: {
                firstName,
                lastName
            },

            auth: {
                email,
                password
            }
        });

        return user;
    }

    async login(email, password){

        const user = await User.findOne({
            "auth.email": email
        }).select("+auth.password");

        if(!user) {
            throw new ApiError(401,"Invalid email or password. ");
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid email or password.");
        }

        await user.icrementLoginCount();
        await user.updateLastSeen();

        user.auth.lastLogin = new Date();

        await user.save();
        return user;
    }
}


module.exports = new AuthService();