const AttendanceModel = require("../models/AttendanceModel");


// Check-In
const checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await AttendanceModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "You have already checked in today.",
      });
    }

    const attendance = await AttendanceModel.create({
      userId,
      date: new Date(),
      checkIn: new Date(),
    });

    res.status(201).json({
      message: "Check-in successful",
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Check-Out
const checkOut = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find today's attendance
    const attendance = await AttendanceModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // User has not checked in
    if (!attendance) {
      return res.status(400).json({
        message: "Please check in first.",
      });
    }

    // User already checked out
    if (attendance.checkOut) {
      return res.status(400).json({
        message: "You have already checked out today.",
      });
    }

    // Update checkout time
    attendance.checkOut = new Date();

    await attendance.save();

    res.status(200).json({
      message: "Check-out successful",
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Today's Attendance
const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await AttendanceModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // No attendance record for today
    if (!attendance) {
      return res.status(200).json({
        message: "No attendance record for today",
        attendance: null,
        checkedIn: false,
        checkedOut: false,
      });
    }

    res.status(200).json({
      message: "Today's attendance fetched successfully",
      attendance,
      checkedIn: !!attendance.checkIn,
      checkedOut: !!attendance.checkOut,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Attendance History
const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    const query = {
      userId,
    };

    // Date filter
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        query.date.$lte = end;
      }
    }

    // Get attendance records
    const attendance = await AttendanceModel.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Total records
    const totalRecords = await AttendanceModel.countDocuments(query);

    const totalPages = Math.ceil(
      totalRecords / limitNumber
    );

    res.status(200).json({
      message: "Attendance history fetched successfully",

      data: attendance,

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Employees Attendance - Admin
const getAllAttendance = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    const query = {};

    // Date filter
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        query.date.$lte = end;
      }
    }

    // Get attendance with employee information
    const attendance = await AttendanceModel.find(query)
      .populate("userId", "name email role")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Total records
    const totalRecords = await AttendanceModel.countDocuments(query);

    const totalPages = Math.ceil(
      totalRecords / limitNumber
    );

    res.status(200).json({
      message: "All attendance records fetched successfully",

      data: attendance,

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAllAttendance
};