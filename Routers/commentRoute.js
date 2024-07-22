const express = require("express")
const commentRouter = express.Router();
const verifyToken = require("../Middlewares/verifyToken")
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const Comment = require("../Models/comment")

// user comments api
commentRouter.post("/add_comment/:postId", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err) {
      return res.status(403).send("Token couldn't be verified");
    }
    const postId = req.params.postId;

    try {
      const comment = {
        userId: authData.userId,
        content: req.body.content,
        createdAt: Date.now(),
        postId: postId
      };

      let data = new Comment(comment)
      let result = await data.save();
      result = await result.populate("userId", "name")
      console.log("result:", result);
      const io = req.app.get('io');
      io.emit('new_comment', result);

      res.status(200).send({
        message: "Comment added successfully"
      });
    } catch (err) {
      res.status(500).send({ message: "Error adding comment", error: err });
    }
  });
});

commentRouter.delete("/delete_comment/:_id", async (req, res)=>{
  try {
    let data = await Comment.deleteOne(req.params)
    res.send({
      message: "comment successfully deleted",
      data: data
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting the post",
      error: error
    });
  }
})

commentRouter.put("/update_comment/:commentId", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err) {
      return res.status(403).send("Token couldn't be verified");
    }

    try {
      let data = await Comment.updateOne(
        {_id: req.params._id},
        {
          $set: {content: req.body.content}
        }
      )

      res.status(200).send({
        message: "Comment updated successfully"
      });
    } catch (err) {
      res.status(500).send({ message: "Error adding comment", error: err });
    }
  });
});

commentRouter.get("/comments/:postId", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (err, authData) => {
    if (err) {
      return res.status(403).send("Token couldn't be verified");
    }
    const postId = req.params.postId;

    try {
      const data = await Comment.find({postId: postId}).populate("userId", "name")
      res.json({data: data, message: "Comments fetched successfully"})
    } catch (err) {
      res.status(500).send({ message: "Error adding comment", error: err });
    }
  });
});

module.exports = commentRouter
