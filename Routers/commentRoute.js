const express = require("express")
const commentRouter = express.Router();
const verifyToken = require("../Middlewares/verifyToken")
const jwt = require("jsonwebtoken");
const cors = require("cors")
const secretKey = "secretkey";
const Post = require("../Models/post")
// user comments api

commentRouter.post("/add_comment/:postId", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err) {
      return res.status(403).send("Token couldn't be verified");
    }
    try {
      const comment = {
        user_id: authData.user_id,
        content: req.body.content,
        createdAt: Date.now(),
      };

      const postId = req.params.postId;
      console.log("postId:", postId);
      console.log("comment:", comment);


      // let updatedPost = await Post.findByIdAndUpdate(
      //   _id,
      //   { $push: { comments: comment } },
      //   { new: true, useFindAndModify: false }
      // );

      // let post = await Post.find({_id: postId})
      // console.log("post:", post);
      // // console.log("updatedPost:", updatedPost);
      // const newPost = await Post.updateOne(post, {$set: {content: "Not new"}})
      // console.log("newPost:", newPost);
      // console.log("post:", post);



      // if (!updatedPost) {
      //   return res.status(404).send({ message: "Post not found" });
      // }

      res.status(200).send({
        message: "Comment added successfully",
        post: updatedPost,
      });
    } catch (err) {
      res.status(500).send({ message: "Error adding comment", error: err });
    }
  });
});


module.exports = commentRouter
