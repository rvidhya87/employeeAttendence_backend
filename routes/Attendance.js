const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendance,
} = require("../controllers/AttendanceController");


// Employee Check-In
router.post(
  "/check-in",
  authMiddleware,
  checkIn
);


// Employee Check-Out
router.post(
  "/check-out",
  authMiddleware,
  checkOut
);


// Today's Attendance
router.get(
  "/today",
  authMiddleware,
  getTodayAttendance
);


// Employee Attendance History
router.get(
  "/history",
  authMiddleware,
  getAttendanceHistory
);


// Admin - All Employees Attendance
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllAttendance
);


module.exports = router;