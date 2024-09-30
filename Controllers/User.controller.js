const jwt = require("jsonwebtoken");
const { users } = require("../Models");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Directly destructuring req.body

    // Check for existing user
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      // Changed to check directly
      return res
        .status(400)
        .json({ msg: "USER ALREADY REGISTERED", status: false });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await users.create({ name, email, password: hash });
    res
      .status(200)
      .json({ msg: "SIGNUP SUCCESS", status: true, userId: newUser.id });
  } catch (err) {
    res
      .status(400)
      .json({ msg: "USER SIGNUP FAILED", error: err.message, status: false });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the registered user
    const registeredUser = await users.findOne({ where: { email } });
    console.log("registeredUser", registeredUser);
    if (!registeredUser) {
      return res
        .status(400)
        .json({ msg: "USER NOT REGISTERED", status: false });
    }

    // Compare password
    const match = await bcrypt.compare(password, registeredUser.password);
    if (!match) {
      return res
        .status(400)
        .json({ msg: "INCORRECT CREDENTIALS", status: false });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: registeredUser.id }, process.env.SECRET);

    return res.status(200).json({
      msg: "Login successful",
      status: true,
      token,
      user: { name: registeredUser.name, email: registeredUser.email },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "USER LOGIN FAILED", error: err.message, status: false });
  }
};

const LoginWithGoogle = async (req, res) => {
  const { token } = req.body; // Token received from the frontend

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("ticket", ticket);

    const googleUser = ticket.getPayload();
    const { email, name } = googleUser;

    console.log("user", email, name);

    // Check if the user already exists in the database
    let existingUser = await users.findOne({ where: { email } });

    if (!existingUser) {
      // If user doesn't exist, create a new user
      existingUser = await users.create({
        name,
        email,
        password: "google-oauth",
      });
    }

    // Generate JWT token for your app
    const jwtToken = jwt.sign({ userId: existingUser.id }, process.env.SECRET);

    // Send the JWT token back to the frontend
    return res.status(200).json({
      msg: "Google login successful",
      status: true,
      token: jwtToken,
      user: { name: existingUser.name, email: existingUser.email },
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(401).json({ msg: "Invalid Google token", status: false });
  }
};

module.exports = {
  Signup,
  Login,
  LoginWithGoogle, // Export the Google login function
};
