require("dotenv").config(); // pulls in all the env variables from our .env

/// to pull in the express library
const express = require("express");

// creates app variable to configure our server
const app = express();

const mongoose = require("mongoose");

// connect to database
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
// events to run when database is connected to
// on error
db.on("error", (error) => console.error(error));
// once its connected and it runs once
db.once("open", () => console.log("connected to database"));

// to make server accept json
// app.use will allow us to use any middleware we want
// middleware runs after server gets request but before it gets passed to your route
app.use(express.json());

const studentsRouter = require("./routes/students");
app.use("/students", studentsRouter);

app.listen(3000, () => console.log("server started"));
