const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      department: user.department
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists with this email" });
    }

    // Validate role
    if (role && !["citizen", "officer", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || "citizen",
      department: role === "officer" ? department : null
    });

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    res.json({
      success: true,
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};