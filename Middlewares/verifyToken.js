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

module.exports = verifyToken