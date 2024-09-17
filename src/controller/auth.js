const express = require("express");
const router = express.Router();
const User = require("../Modal/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // Check if the user already exists
    const userEmail = await User.findOne({
        email
    });

    const userName = await User.findOne({
      username
    });

    if (userName) {
      return res.status(400).json({ msg: "userName already taken" });
    }

    if (userEmail) {
      return res.status(400).json({ msg: "email already exists" });
    }

    const user = new User({
      username,
      email,
      password,
    });

    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({
      message: "User signup sucessfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { login, signup };
