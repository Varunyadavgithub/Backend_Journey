// This will be the starting file of the project

const express = require("express");
const app=express();
const mongoose = require("mongoose");
const server_config = require("./configs/server.config");
const db_config = require("./configs/db.config");
const user_model = require("./models/user.model");
const bcrypt = require("bcryptjs");

// Create a admin user at the starting of the application, if not already present.

// Connecting with mongodb
mongoose.connect(db_config.DB_URL);

const db=mongoose.connection

db.on("error",()=>{
    console.log("Error while connectiong to mongoDB");
})

db.once("open",()=>{
    console.log("Connected to MongoDB");
    init();
})

async function init(){
    try{
        let user = await user_model.findOne({userId:"admin"});
        if(user){
            console.log("Admin is already present")
            return
        }
    }catch(err){
        console.log("Error while reading data", err);
    }

    try{
        user = await user_model.create({
            name: "Varun",
            userId: "admin", 
            email: "vy056038@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("welcome1",8)
        })
        console.log("Admin created ",user);
    }
    catch(err){
        console.log("Error while create admin",err);
    }
}

// Start the server on port no. 8000
app.listen(server_config.PORT,()=>{
    console.log("Server started at port number: ",server_config.PORT);
})