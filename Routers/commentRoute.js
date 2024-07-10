const express = require("express")
const commentRouter = express.Router();
const verifyToken = require("../Middlewares/verifyToken")
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";

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
