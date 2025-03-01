import express from "express";
import {
  logIn,
  logout,
  resetPassword,
  sendOtpForResetPassword,
  signUp,
  updatePassword,
} from "../controllers/auth.controllers.js";
import { check } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyUser from "../middlewares/verifyUser.middleware.js";
const router = express.Router();

router.post(
  "/signup",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("displayName", "Display name is required").not().isEmpty(),
  ],

  signUp
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  logIn
);

router.post(
  "/updatepassword",
  [
    check("newPassword", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("oldPassword", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  verifyUser,
  updatePassword
);

//routes for logout

router.post("/logout", verifyUser, logout);

//route for the password reset

router.post(
  "/otp",
  [check("email", "Please include a valid email").isEmail()],
  verifyUser,
  sendOtpForResetPassword
);

router.post(
  "/forgot",[
    check("otp", "otp must be at least 6 digits").isLength({
      min: 6,
    }),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    })
  ],
  verifyUser,
  resetPassword
);

//gooole auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, //for one day
    };

    res
      .status(200)
      .cookie("accessToken", req.user.accessToken, options)
      .cookie("refreshToken", req.user.refreshToken, options)
      .json({
        success: true,
        token,
        user: {
          email: req.user.email,
          displayName: req.user.displayName,
        },
      });
  }
);

export default router;
