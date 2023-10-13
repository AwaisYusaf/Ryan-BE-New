"use strict";
const express = require("express");
const dotenv = require("dotenv");
const moviesRouter = require("./routes/moviesRouter");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/movies", moviesRouter);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(5000, () => console.log(""));
