const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/token.util.js");

class AuthService {

    async getCurrentUser(userId){
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found.");
        }
        return user;
    }
    
    async register(userData) {
        const {
            firstName,
            lastName,
            email,
            password,
        } = userData;

        const existingUser = await User.findOne({
            "auth.email": email,
        });

        if (existingUser) {
            throw new ApiError(409, "Email already registered.");
        }

        const user = await User.create({
            profile: {
                firstName,
                lastName,
            },
            auth: {
                email,
                password,
            },
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.auth.password;
        delete userResponse.refreshToken;

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }

    async login(email, password) {
        const user = await User.findOne({
            "auth.email": email,
        }).select("+auth.password +refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Credentials.");
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid Credentials.");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        user.incrementLoginCount();
        user.updateLastSeen();
        user.auth.lastLogin = new Date();

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.auth.password;
        delete userResponse.refreshToken;

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }

}

module.exports = new AuthService();