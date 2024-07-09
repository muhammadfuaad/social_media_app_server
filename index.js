const express = require("express");
const PORT = 3000;
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const User = require("./Models/user");
const Post = require("./Models/post")
const cors = require('cors');
require("./config");
const userRouter = require("./routers/userRoute")

const app = express();
app.use(cors());
app.use(express.json());

// register
app.use('/', userRouter);

// user posts api
app.get("/user_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({user_id: authData.user_id})
      // console.log("data:", data);
      res.json({data: data, user_id: authData.user_id})
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

app.post("/new_comment", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async(err, authData) => {
    try {
      const comment = {content: req.body.content, user_id: authData.user_id}
      let data = new Post(comment);
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

// all posts api
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

// all users api
app.get("/users", verifyToken, async(req, res)=>{
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

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
