const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/user.model");
const { authenticate } = require("../middlewares/authenticate");

const userRoute = express.Router();

// Register
userRoute.post("/register", async (req, res) => {
  try {
    let data = req.body;
    const user = new Usermodel(data);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log({ err: err.message });
  }
});

// Login
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usermodel.findOne({ email });
    if (user != undefined) {
      let result = await bcrypt.compare(password, user.password);
      if (result == true) {
        const token = await jwt.sign({ userId: user._id }, process.env.key);
        res.send({ token, userId: user._id });
      } else {
        res.send({ msg: "wrong credential" });
      }
    } else {
      res.send({ msg: "wrong credential" });
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log({ err: err.message });
  }
});

// Get Profile
userRoute.get("/getProfile/", authenticate, async (req, res) => {
    let ID = req.params.id;
  try {
    const user = await Usermodel.find();
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log({ err: err.message });
  }
});

// Get user Profile
userRoute.get("/getProfile/:id", authenticate, async (req, res) => {
    let ID = req.params.id;
  try {
    const user = await Usermodel.findOne({_id: ID});
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log({ err: err.message });
  }
});

// Edit Profile
userRoute.put("/editProfile/:id", authenticate, async (req, res) => {
  try {
    let update = req.body;
    let ID = req.params.id;
    const user = await Usermodel.findByIdAndUpdate({ _id: ID }, update);
    res.send(`User data with ID ${ID} is updated`);
  } catch (err) {
    res.status(404).send("Something went wrong");
    console.log({ err: err.message });
  }
});

module.exports = {
  userRoute,
};
