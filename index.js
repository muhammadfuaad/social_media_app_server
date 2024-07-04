const express = require("express");
const PORT = 3000;
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const User = require("./user");
const Post = require("./post")
const cors = require('cors');
require("./config");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  let data = new User(req.body);
  let result = await data.save();
  res.send(result);
});

app.post("/login", async (req, res) => {
  const user = req.body;
  console.log("user.email:", user.email);
  const editUserArray = await User.find({email: user.email}).exec()
  const editUser = editUserArray[0]

  if (editUser.length !== 0 && user.password === editUser.password) {
      // res.send("User exists and password is correct");
      console.log("User exists and password is correct");
      
      jwt.sign({ user_id: editUser._id }, secretKey, (err, token) => {
        if (err) {
          res.status(500).send('Error signing token');
        } else {
          res.json({ token });
        }
      });

  } else if (editUser.length === 0) {
      // res.send("User doesn't exist");
      console.log("User doesn't exist");
  } else if (editUser.length !== 0 && user.password !== editUser.password) {
      // res.send("User exists but password is incorrect");
      console.log("User exists but password is incorrect");
  } else {
      console.log("none of the above");
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log("bearerHeader:", bearerHeader);
  
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    if (bearer.length === 2 && bearer[0] === "Bearer") {
      const bearerToken = bearer[1];
      console.log("req.token:", req.token);
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
}

app.post("/profile", verifyToken, (req, res) => {
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

app.get("/user_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({user_id: authData.user_id})
      console.log("data:", data);
      res.send(data)
    }
  });
})

app.post("/new_post", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const post = {content: req.body.content, user_id: authData.user_id}
      let data = new Post(post);
      let result = await data.save();
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
