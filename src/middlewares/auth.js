const User = require("../models/user");
const jwt = require("jsonwebtoken");

const Userauth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Token not valid!!!!!!!");
    }

    const decodedmessage = await jwt.verify(token, "DevTinder@26");
    console.log(decodedmessage, "decoded message");
    const { _id } = decodedmessage;
     const users = await User.findOne({ _id: _id });
 

    const user = await User.findOne({ _id: _id });

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach the user object to the request for further use
    next();
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};
module.exports = { Userauth };
