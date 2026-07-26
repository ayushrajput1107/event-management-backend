const authService = require("../services/auth.services.js");
const asyncHandler = require("../utils/asyncHandler.js");
const cookieOptions = require("../utils/cookieOptions.js");

class AuthController {
    // async register(req,res){
    //     try{
    //         const user = await authService.register(req.body);

    //         return res.status(201).json({
    //             success: true,
    //             message: "User registered successfully.",
    //             data: user
    //         });
    //     }


    //     catch(error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }


getCurrentUser = asyncHandler(async (req,res) => {
    const user = await authService.getCurrentUser(req.user._id);
    return res.status(200).json({
        success: true,
        data: user
    });
});



register = asyncHandler(async (req, res, next) => {
    const user = await authService.register(req.body);

    res.cookie(
        "refreshToken",
        user.refreshToken,
        cookieOptions
    );

    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        accessToken: user.accessToken,
        data: user,
    });
});


login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    res.cookie(
        "refreshToken",
        user.refreshToken,
        cookieOptions
    );

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        accessToken: user.accessToken,
        data: user,
    });
});



    // async login(req,res){
    //     try{
    //         const{
    //             email,
    //             password
    //         } = req.body;

    //         const user = await authService.login(email, password);

    //         return res.status(200).json({
    //             success: true,
    //             message: "Login successfull",
    //             data: user
    //         });
    //     }

    //     catch(error){
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }



    // login = asyncHandler(async(req,res) => {
    //     const {email, password} = req.body;

    //     const user = await authService.login(email,password);

    //     res.cookie(
    //         "refreshToken",
    //         user.refreshToken,
    //         cookieOptions
    //     );

    //     return res.status(200).json({
    //         success: true,
    //         message: "Login successful.",
    //         accessToken: user.accessToken,
    //         data: user
    //     });
    // });
}



module.exports = new AuthController();