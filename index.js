const express = require("express")
const PORT = 3000
const jwt = require("jsonwebtoken")
const secretKey = "secretkey"
const User = require("./user")
const cors = require('cors')
require("./config")


const app = express()
app.use(cors())
app.use(express.json())

app.post("/register", async (req, res)=>{
  console.log("req.body:", req.body);
  console.log("req:", req);
  console.log("req.userData:", req.userData);


  let data = new User(req.body)
  console.log("data:", data);
  console.log(`success`);
  let result = await data.save()
  console.log(result);
  res.send(req.body)
})

app.post("/login", async(req, res)=>{
  const user = req.body
  jwt.sign({user}, secretKey, (err, token)=>{
    res.json({token})
    console.log("token:", token);
    localStorage.setItem("token", token)
  })
  // res.json("Hi")
  console.log("user:", user);
})

app.post("/profile", verifyToken, (req, res)=>{
  jwt.verify(req.token, secretKey, (err, authData)=>{
    if(err) {
      res.send("Error is there")
    } else {
      res.json({
        msg: "Success",
        authData
      })
    }
  })
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== "undefined") {
    // res.send("There is no error")
    const bearer = bearerHeader.split("")
    const token = bearer[1]
    req.token = token
    next()
    console.log("token:", token);
    console.log("req.token:", req.token);
    console.log("bearer:", bearer);
    console.log("bearerHeader:", bearerHeader);



  } else {
    res.send("Wow There is some error")
  }
  // res.send(bearerHeader)
  
}

app.listen(PORT, ()=>{
  console.log(`server is runnng at ${PORT}`);
})