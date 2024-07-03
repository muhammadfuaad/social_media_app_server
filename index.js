const express = require("express");
const PORT = 3000;
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const User = require("./user");
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
  jwt.sign({ user }, secretKey, (err, token) => {
    if (err) {
      res.status(500).send('Error signing token');
    } else {
      res.json({ token });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
}

app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send("Error is there");
    } else {
      res.json({
        msg: "Success",
        authData
      });
    }
  });
});


app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
