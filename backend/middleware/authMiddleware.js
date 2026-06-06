const jwt = require('jsonwebtoken')
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  // console.log("🔐 Middleware `protect` triggered");
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
       // console.log("📌 Token received:", token);
  
        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("✅ Token decoded:", decoded);
  
        req.user = await User.findById(decoded.id).select("-password");
        //console.log("👤 Authenticated user:", req.user);
  
        next();

      } catch (error) {
        console.error("❌ Token verification failed:", error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  
    if (!token) {
      console.log("❌ No token found");
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
  
  module.exports = { protect };