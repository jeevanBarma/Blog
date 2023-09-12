const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: "You must provide email and password" });
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).send({ error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(400).send({ error: "password not match" });
    }
    const token = jwt.sign({ email }, "MY_SCECRET_CODE");
    return res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ error: "Error in Login" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ error: "You must provide all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      blogs: [],
    });

    await newUser.save();
    const token = jwt.sign({ email }, "MY_SCECRET_CODE");
    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
