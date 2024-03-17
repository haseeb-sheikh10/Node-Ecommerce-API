const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    token = token.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await User.findOne({ _id: user.id });
    if (!userExist) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = userExist;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
