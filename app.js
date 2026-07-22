const express = require('express')
const authRoutes = require("./routes/auth.routes.js");
const app = express();

app.use(express.json());
app.use("/api/auth",authRoutes);

app.get('/',(req,res)=>{
    res.send("Hy there !");
})


const errorMiddleware = require("./middlewares/error.middleware.js");
app.use(errorMiddleware);
module.exports = app;