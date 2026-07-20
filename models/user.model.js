const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const profileSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
        },

        lastName:{
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
        },
        avatar:{
            type: String,
            default: null,
        },
    },
    { _id: false}
);



const authSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
        },

        password:{
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        isVerified:{
            type: Boolean,
            default: false,
        },

        lastLogin:{
            type: Date,
            default: null,
        },
    },
    { _id: false}
);



const authorizationSchema = new mongoose.Schema(
    {
        role:{
            type: String,
            enum:[
                "ADMIN",
                "VERIFIED_ORGANIZER",
                "ORGANIZER",
                "ATTENDEE",
            ],
            default: "ATTENDEE",  
        },

        extraPermissions:{
            type: [String],
            default: [],
        },
    },
    { _id: false}
);



const accountSchema = new mongoose.Schema(
    {
        status:{
            type: String,
            enum: ["ACTIVE","SUSPENDED","DELETED"],
            default: "ACTIVE",
        },

        suspendedUntil:{
            type: Date,
            default: null,
        },

        suspensionReason:{
            type: String,
            default: "",
        },
    },

    { _id: false}
);



const userSchema = new mongoose.Schema(
    {
        profile: profileSchema,
        auth: authSchema,
        authorization: authorizationSchema,
        account: accountSchema,

        loginCount:{
            type: Number,
            default: 0,
        },

        lastSeen:{
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps:true,
    }
)


userSchema.index(
    {
        "auth.email": 1
    },
    {
        unique:true
    }
);

userSchema.index({
    "authorization.role": 1
});

userSchema.index(
    {
        "account.status": 1
    }
);


userSchema.pre("save" ,async function (next) {
    if(!this.isModified("auth.password"))return next();
    const salt = await bcrypt.genSalt(10);
    this.auth.password = await bcrypt.hash(this.auth.password,salt);
    next();
});




userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password,this.auth.password); 
};




userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            id: this._id,
            role: this.authorization.role,
        },

        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }
    );
};


userSchema.methods.updateLastSeen = async function(){
    this.lastSeen = new Date();
    await this.save();
};

userSchema.methods.incrementLoginCount = async function(){
    this.loginCount += 1;
    await this.save();
};

const User = mongoose.model("User",userSchema);
module.exports = User;