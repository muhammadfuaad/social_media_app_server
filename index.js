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

// register
app.post("/register", async (req, res) => {
  let data = new User(req.body);
  let result = await data.save();
  res.send(result);
});

// login
app.post("/login", async (req, res) => {
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

// user posts api
app.get("/user_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({user_id: authData.user_id})
      // console.log("data:", data);
      res.send(data)
    }
  });
})

app.post("/new_post", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async(err, authData) => {
    try {
      const post = {content: req.body.content, user_id: authData.user_id, user_name: authData.user_name}
      let data = new Post(post);
      let result = await data.save();
      console.log("authData:", authData);
      res.status(200).send({
        message: "Post added successfiully",
        result: result
      });
    } catch (err) {
      res.send("Token couldn't be verified");
    }
  })
});

app.delete("/delete_post/:_id", async (req, res)=>{
  // console.log(req.params);
  try {
    let data = await Post.deleteOne(req.params)
    res.send({
      message: "Post successfully deleted",
      data: data
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting the post",
      error: error
    });
  }
})

app.put("/update_post/:_id", async (req, res)=>{
  // console.log(req.params);
  // console.log(req.body);

  try {
  let data = await Post.updateOne(
    {_id: req.params._id},
    {
      $set: {content: req.body.content}
    }
  )
  let changedData = await Post.find({_id: req.params})
  let changedData2 = JSON.stringify(changedData)
  res.send({message: "Post updated successfully", "data": data, "changedData": (changedData2)}) 
} catch (error) {
  res.status(500).send({
    message: "Error deleting the post",
    error: error
  });
}
})

app.get("/all_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({})
      // console.log("data:", data);
      res.send(data)
    }
  });
})

app.listen(PORT, () => {
  // console.log(`server is running at ${PORT}`);
});
