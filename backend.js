// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
port=process.env.PORT || 4000;

// Importing database connection and model
require("../dbconnection/db.js");
const model = require("../model/model.js");

// Initializing express server
const server = express();

// Middleware setup
server.use(cors());
server.use(bodyParser.json());

// Define schema and model for user prompts
const promptSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    }
});
const PromptModel = new mongoose.model("prompt", promptSchema);

// Routes

// Home Page route

// POST request for signup (User Registration)
server.post("/gemeni/user", async (req, res) => {
    try {
        const dataAccess = new model({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const token=await dataAccess.generateWebtoken();
        console.log(token);
        res.cookie("jwt",token , {
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:24 * 60 * 1000,
        });

        
        await dataAccess.save();
        res.status(201).send("User registered successfully!");
    } catch (err) {
        res.status(500).send("Error occurred while registering user.");
        console.log(err);
    }
});

// GET request for fetching all users
server.get("/gemeni/user", async (_req, res) => {
    try {
        const users = await model.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send("Error occurred while fetching users.");
        console.log(err);
    }
});

// POST request for login (User Authentication)
server.post("/login/user", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await model.findOne({ email: email });
        const token=await user.generateWebtoken();
        console.log("the token is : ",token);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        if (password === user.password) {
            return res.status(200).send("Login successful.");
        } else {
            return res.status(401).send("Invalid credentials.");
        }
    } catch (err) {
        res.status(500).send("Error occurred during login.");
        console.log(err);
    }
});

// GET request for fetching login data
server.get("/login/user", async (_req, res) => {
    try {
        const users = await model.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send("Error occurred while fetching login data.");
        console.log(err);
    }
});

// POST request for user prompt (Save user prompt)
server.post("/userprompt", async (req, res) => {
    try {
        const promptAccess = new PromptModel({
            prompt: req.body.prompt,
        });

        await promptAccess.save();
        res.status(201).send("Prompt saved successfully.");
    } catch (err) {
        res.status(500).send("Error occurred while saving prompt.");
        console.log(err);
    }
});

// get method for the access the prompt...
server.get("/userprompt/input",async(_req , res)=>{
    try{
        const datasent=await PromptModel.find();
        res.status(201).send(datasent);
    }catch(err){
        res.status(404).send(err);
    }
});





// deployeement....

const path=require("path");
const pathaccess=path.join(__dirname,"../../googlegemeni/build");
server.use(express.static(pathaccess));
console.log(pathaccess);
server.get("/",(_req , res)=>{
    res.sendFile(path.join(pathaccess,"index.html"));
});
server.get("*",(_req , res)=>{
    res.sendFile(path.join(pathaccess,"index.html"));
});



// Server listening
server.listen(port, () => {
    console.log("Server running on port 4000...");
});
