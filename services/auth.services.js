const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

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
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        
        user.refreshToken = hashedRefreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.auth.password;
        // delete userResponse.refreshToken;

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
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        
        user.refreshToken = hashedRefreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        user.loginCount += 1;
        user.lastSeen = new Date();
        user.auth.lastLogin = new Date();


        await user.save();

        const userResponse = user.toObject();
        delete userResponse.auth.password;
        delete userResponse.refreshToken;
        delete userResponse.refreshTokenExpiresAt;
      

        return {
            user: userResponse,
            accessToken,
            refreshToken,
        };
    }





    async refreshToken(refreshToken){
        if(!refreshToken){
            throw new ApiError(401,"Refresh Token missing.");
        }

        let decoded;
        try{
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        }catch{
            throw new ApiError(401,"Invalid or expired refresh token.");
        }

        const user = await User.findById(decoded.id).select("+refreshToken");
        if(!user)throw new ApiError(401,"User not found.");

        const isValid = await bcrypt.compare(refreshToken,user.refreshToken);

        if(!isValid)throw new ApiError(401,"Invalid Refresh Token. ");

        const newAccesssToken = generateAccessToken(user);
        const newRefreshtoken = generateRefreshToken(user);

        const hashedRefreshToken = await bcrypt.hash(newRefreshtoken,10);
        user.refreshToken = hashedRefreshToken;

        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await user.save();

        return {
            accessToken: newAccesssToken,
            refreshToken: newRefreshtoken,
        };

    }





    async logout(refreshToken){
        if(!refreshToken)return;
        let decoded;
        try{
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        }catch{
            return;
        }


        const user = await User.findById(decoded.id);

        if(!user)return;
        user.refreshToken = null;
        user.refreshTokenExpiresAt : null;

        await user.save();
    }




}

module.exports = new AuthService();