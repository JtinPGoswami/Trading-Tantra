import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/email.js";

//signup controller

const signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, displayName } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User Already exist" });

    let hashedPassword = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    user = new User({
      email,
      password: hashedPassword,
      displayName,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// login controller

const logIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not Exist, please sign up" });
    }
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ error: "Please sign in with Google" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, //for one day
    };

    res
      .status(200)
      .cookie("accessToken", token, options)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error in login" });
  }
};

const updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { oldPassword, newPassword } = req.body;

    const loggedInUser = req.user;

    const user = await User.findOne({ email: loggedInUser.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    let hashedPassword;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changes successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in changing the password",
    });
  }
};

//logout

const logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, //for one day
    };

    res.status(200).clearCookie("accessToken", options).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in logging out ",
    });
  }
};

//reset password

const sendOtpForResetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Email!" });
    }

    let generateOtp = Math.floor(100000 + Math.random() * 900000).toString();

    let expTime = Date.now() + 5 * 60 * 1000;

    user.otp = generateOtp;
    user.otpExpiry = expTime;

    const updatedUser = await user.save({ validateBeforeSave: false });

    await sendEmail(updatedUser.email, generateOtp);

    res.status(200).json({ success: true, message: "otp successfully send!" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error in sending otp",
    });
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { password, otp } = req.body;

    const loggedInUser = req.user;

    console.log('logged', loggedInUser)

    const user = await User.findOne({ email: loggedInUser.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Email!" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({ success: false, message: "otp expire" });
    }

    if (otp !== user.otp) {
      return res
        .status(401)
        .json({ success: false, message: "otp does not match" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    user.password = hashedPassword;

    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error in password changing",
      });
  }
};

export {
  signUp,
  logIn,
  updatePassword,
  logout,
  sendOtpForResetPassword,
  resetPassword,
};
