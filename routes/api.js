const express = require("express");
const app = module.exports = express.Router();
const { r } = require("../app");
const Joi = require("joi");
// datamined from the discord api docs
const libList = ["discordcr","Discord.Net","DSharpPlus","dscord","DiscordGo","Discord4j","JDA","discord.js","Eris","Discordia","RestCord","Yasmin","discord.py","disco","discordrb","discord-rs","Sword"];

app.use((req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
        res.status(403).json({error: "not_authenticated"});
    }
});

app.get("/", (req, res) => {
    res.json({success: "you found the api!"});
});


const newBotSchema = Joi.object().keys({
    shortDescription: Joi.string().max(200).required(),
    id: Joi.string().length(18).required(),
    longDescription: Joi.string().max(1500).required(),
    invite: Joi.string().uri({scheme: ["https", "http"]}).required(),
    website: Joi.string().uri({scheme: ["https", "http"]}),
    library: Joi.string() // extra validation later
});

app.post("/bot", async (req, res) => {
    if (typeof req.body !== "object") return res.sendStatus(400);

    const wdjt = Joi.validate(req.body, newBotSchema); // What Does Joi Think (wdjt)
    if (wdjt.error) {
        if (!wdjt.error.isJoi) {
            console.error("Error while running Joi for signup data validation.", wdjt.error);
            res.sendStatus(500);
            return;
        }
        res.status(400).json({error: wdjt.error.name, details: wdjt.error.details.map(item => item.message)});
        return;
    }

    // TODO: Using the discord bot, check if their ID is existant.

    // Filter out all of the data that we don't expect.
    const data = {ownerID: req.user.id, createdAt: new Date().getTime()};
    Object.keys(newBotSchema.describe().children).forEach(key => {
        data[key] = req.body[key];
    });
    

    // TODO: Call draem's data manager magic
});


app.use((req, res) => {
    res.status(404).json({error: "endpoint_not_found"});
});