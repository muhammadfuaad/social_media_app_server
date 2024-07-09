const express = require("express")
const userRouter = express.Router();
const User = require("../Models/user")

userRouter.post("/register", async (req, res) => {
  console.log("req.body:", req.body);
  const data = await User.find({email: req.body.email})
  if (data.length > 0) {
    res.status(400).send({message: "User already registered"})
  } else {
    let data1 = new User(req.body);
    let result = await data1.save();
    res.send(result);
  }
});

module.exports = userRouter