const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = authentication;
