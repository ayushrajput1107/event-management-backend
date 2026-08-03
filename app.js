const express = require('express')
const authRoutes = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware.js");
const adminRoutes = require("./routes/admin.routes.js");
const organizerApplicationRoutes = require("./routes/organizerApplication.routes.js")
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/organizer",organizerApplicationRoutes);
app.use("/api/admin",adminRoutes);

app.use(errorMiddleware);

module.exports = app;