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

// login
userRouter.post("/login", async (req, res) => {
  const user = req.body;
  // console.log("user.email:", user.email);
  const editUserArray = await User.find({email: user.email}).exec()
  const editUser = editUserArray[0]
  console.log("editUser:", editUser);

  if (editUser.length !== 0 && user.password === editUser.password) {
      // res.send("User exists and password is correct");
      // console.log("User exists and password is correct");
      
      jwt.sign({ user_id: editUser._id, user_name: editUser.name }, secretKey, (err, token) => {
        if (err) {
          res.status(500).send('Error signing token');
        } else {
          res.json({ token });
        }
      });

  } else if (editUser.length === 0) {
      // res.send("User doesn't exist");
      // console.log("User doesn't exist");
  } else if (editUser.length !== 0 && user.password !== editUser.password) {
      // res.send("User exists but password is incorrect");
      // console.log("User exists but password is incorrect");
  } else {
      // console.log("none of the above");
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  // console.log("bearerHeader:", bearerHeader);
  
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    if (bearer.length === 2 && bearer[0] === "Bearer") {
      const bearerToken = bearer[1];
      // console.log("req.token:", req.token);
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
}

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

module.exports = userRouter