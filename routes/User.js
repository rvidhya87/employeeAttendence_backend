const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
} = require("../controllers/UserController");

const authMiddleware = require("../middleware/authMiddleware");


// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "User route is working",
  });
});


// Register
router.post(
  "/register",
  registerUser
);


// Login
router.post(
  "/login",
  loginUser
);


// Profile
router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);


// Change Password
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


module.exports = router;