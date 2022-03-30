const socket = io();

var name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
do {
  name = prompt("Please enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (txt) => {
  if (txt.key === "Enter") {
    sendMessage(txt.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    name: name,
    message: message.trim(),
  };

  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.name}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  console.log(msg);
  scrollToBottom();
});
//----to show chat history
socket.on("chatHistory", (data) => {
  for (d in data) {
    if (data[d].name == name) {
      appendMessage(data[d], "outgoing");
    } else {
      appendMessage(data[d], "incoming");
    }
  }
});
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
