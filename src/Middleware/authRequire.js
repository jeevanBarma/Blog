const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  let token;
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    }
    if (token === undefined) {
      res.status(401).send({ error: "Invalid jwt Token" });
    } else {
      jwt.verify(token, "MY_SCECRET_CODE", async (error, payload) => {
        if (error) {
          res.status(401).send({ error: "invalid token" });
        } else {
          req.email = payload.email;
          next();
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
