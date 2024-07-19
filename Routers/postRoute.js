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
      const data = await Post.find({userId: authData.userId}).populate("userId", "name")
      // console.log("data:", data);
      res.json({data: data, userId: authData.userId})
    }
  });
})

postRouter.post("/new_post", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async(err, authData) => {
    try {
      const post = {content: req.body.content, userId: authData.userId}
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
      const data = await Post.find({}).populate("userId", "name")
      // console.log("data:", data);
      res.send(data)
    }
  });
})

postRouter.post("/like_post/:_id", verifyToken, async (req, res)=>{
  console.log(req.params);
  jwt.verify(req.token, secretKey, async(err, authData) => {
    if (err) {
      res.send("Token couldn't be verified");
    } 
    
    try {
      const editPost = await Post.findById(req.params._id)
      console.log(editPost);
      const alreadyLiked = editPost.likes.some(like => like.userId.toString() === authData.userId.toString());
      if (alreadyLiked) {
        console.log('already liked');
        const result = await Post.updateOne({_id: req.params._id}, { $pull: { likes: { userId: authData.userId } } })
        console.log(result);
      } else {
        const result = await Post.updateOne({_id: req.params._id}, { $push: { likes: { userId: authData.userId } } })
        console.log(result);
        console.log('liked now');
      }
    }
    catch (error) {
      console.error('Error processing like/unlike:', error);
      res.status(500).send('Server error');
    }
  })
})

// postRouter.post("/like_post/:_id", verifyToken, async (req, res) => {
//   console.log('req.params:', req.params);
//   jwt.verify(req.token, secretKey, async (err, authData) => {
//     if (err) {
//       res.send("Token couldn't be verified");
//     } else {
//       try {
//         const editPost = await Post.findById(req.params._id);
//         if (!editPost) {
//           return res.status(404).send("Post not found");
//         }
//         console.log('editPost:', editPost);
//         console.log('editPost.content:', editPost.content);

//         // const likes = editPost.likes;
//         // console.log('likes:', likes);

//         // likes.push({ userId: authData.userId });
//         // console.log('updated likes:', likes);

//         const result = await Post.updateOne(
//           { _id: req.params._id },
//           { $push: { likes: { userId: authData.userId } } }
//         );
//         console.log('result:', result);
//         res.send("Like added successfully");
//       } catch (error) {
//         console.error('Error updating post:', error);
//         res.status(500).send("Internal Server Error");
//       }
//     }
//   });
// });

module.exports = postRouter