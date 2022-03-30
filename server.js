const express = require("express");
const app = express();
const http = require("http").createServer(app);
app.use(express.static(__dirname + "/public"));

//connectivity with firebase

var admin = require("firebase-admin");

var serviceAccount = require("./chat.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mymy-chat-default-rtdb.firebaseio.com",
});
var db = admin.database();
var ref = db.ref("chat-document");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected...");

  //---to show chat history
  ref.once("value", (snap) => {
    data = snap.val();
    console.log(data);
    socket.emit("chatHistory", data);
  });
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
    //--to save in database
    value = { name: msg.name, message: msg.message };

    ref.push(value);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
