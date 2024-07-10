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
        user_id: authData.user_id,
        content: req.body.content,
        createdAt: Date.now(),
        post_id: postId
      };

      let data = new Comment(comment);
      let result = await data.save();
      console.log("result:", result);

      res.status(200).send({
        message: "Comment added successfully"
      });
    } catch (err) {
      res.status(500).send({ message: "Error adding comment", error: err });
    }
  });
});

module.exports = commentRouter
