const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user_management_system");
const path = require('path')

const express = require("express");
const app = express();

const nocache = require('nocache');
app.use(nocache());
app.use("/static",express.static(path.join(__dirname,"public")));

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("Server is running...");
});