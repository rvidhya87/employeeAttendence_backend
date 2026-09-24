const adminMiddleware = (req, res, next) => {
  try {
    // Check if logged-in user is Admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = adminMiddleware;