const express = require("express");
const PORT = 3000;
const cors = require('cors');
require("./config");
const userRouter = require("./routers/userRoute")
const postRouter = require("./routers/postRoute");
const commentRouter = require("./Routers/commentRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', userRouter);
app.use('/', postRouter)
app.use('/', commentRouter)

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
