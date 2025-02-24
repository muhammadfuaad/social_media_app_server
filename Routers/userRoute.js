const express = require("express")
const userRouter = express.Router();
const User = require("../Models/user")
const verifyToken = require("../Middlewares/verifyToken")
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";

// register
userRouter.post("/register", async (req, res) => {
  console.log("req.body:", req.body);
  const data = await User.find({email: req.body.email})
  console.log('data:', data);

  if (data.length > 0) {
    res.status(400).send({message: "User already registered"})
  } else {
    let data1 = new User(req.body);
    let result = await data1.save();
    res.status(200).json({message: "User successfully registered", result})
    // res.send({message: "User successfully registered", result})
    // question: what's the difference bwteen above two statements?
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const user = req.body;
  // console.log("user.email:", user.email);
  const editUserArray = await User.find({email: user.email}).exec()
  // question: whats the use of '.exec()' ?
  const editUser = editUserArray[0]
  console.log("editUser:", editUser);

  if (editUser.length !== 0 && user.password === editUser.password) {
      // console.log("User exists and password is correct");
      
      jwt.sign({ userId: editUser._id, user_name: editUser.name }, secretKey, (err, token) => {
        if (err) {
          res.status(500).json({message: 'Error signing token'});
        } else {
          res.status(200).json({ message: 'Token successfully generated', token });
        }
      });

  } else if (editUser.length === 0) {
    // console.log("User doesn't exist");
  } else if (editUser.length !== 0 && user.password !== editUser.password) {
    // console.log("User exists but password is incorrect");
  } else {
    // console.log("none of the above");
  }
});

// profile
userRouter.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      res.json({
        msg: "Token verified successfully",
        authData
      });
    }
  });
});

// all users api
userRouter.get("/users", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await User.find({})
      // console.log("data:", data);
      res.send(data)
    }
  });
})

module.exports = userRouter