module.exports = (req, res, next) => {
  if (!req.user.department) {
    return res.status(403).json({ msg: "No department assigned" });
  }
  req.department = req.user.department;
  next();
};