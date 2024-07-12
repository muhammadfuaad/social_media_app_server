const express = require("express")
const postRouter = express.Router();
const Post = require("../Models/post")
const verifyToken = require("../Middlewares/verifyToken")
const jwt = require("jsonwebtoken");
const cors = require("cors")
const secretKey = "secretkey";
// user posts api
postRouter.get("/user_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({user_id: authData.user_id}).populate("user_id", "name")
      // console.log("data:", data);
      res.json({data: data, user_id: authData.user_id})
    }
  });
})

postRouter.post("/new_post", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async(err, authData) => {
    try {
      const post = {content: req.body.content, user_id: authData.user_id}
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

postRouter.delete("/delete_post/:_id", async (req, res)=>{
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

postRouter.put("/update_post/:_id", async (req, res)=>{
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
postRouter.get("/all_posts", verifyToken, async(req, res)=>{
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } else {
      const data = await Post.find({}).populate("user_id", "name")
      // console.log("data:", data);
      res.send(data)
    }
  });
})

module.exports = postRouter