const express = require('express')
const authRoutes = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);

app.use(errorMiddleware);

module.exports = app;