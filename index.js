const express = require("express");
const app = express();

const PORT = 3000;
const cors = require('cors');
require("./config");
const userRouter = require("./routers/userRoute")
const postRouter = require("./Routers/postRoute");
const commentRouter = require("./Routers/commentRoute");

app.use(cors());
app.use(express.json());
var options = {'root': 'C:/Users/Dell/Desktop/Fuaad/coding_practice/projects/social_media_app/server'};

app.get('/', function(req, res){ res.sendFile('/index.html', options);
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

app.use('/', userRouter);
app.use('/', postRouter)
app.use('/', commentRouter)

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
