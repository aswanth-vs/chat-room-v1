(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let username;

  //when a user joins
  app.querySelector(".join-screen #join-user").addEventListener("click", () => {
    let name = app.querySelector(".join-screen #username").value;
    if (name.length == 0) {
      alert("Enter a Username");
    } else {
      socket.emit("newUser", name);
      username = name;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    }
  });

  //sending a message
  app.querySelector(".chat-screen #send-message").addEventListener("click", () => {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }
    renderMessage("my", {
      username: username,
      text: message,
    });

    socket.emit("chat", {
      username: username,
      text: message,
    });
    app.querySelector(".chat-screen #message-input").value = "";
  });

  //to exit a chat
  app.querySelector(".chat-screen #exit-chat").addEventListener("click", () => {
    socket.emit("exit", username);
    window.location.href = window.location.href;
  });

  //update the chat
  socket.on("update", (update) => {
    renderMessage("update", update);
  });

  socket.on("chat", (message) => {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    //you send a message
    if (type == "my") {
      let elem = document.createElement("div");
      elem.setAttribute("class", "message my-message");
      elem.innerHTML = `
      <div>
        <div class="name">You</div>
        <div class="text">${message.text}</div>
      </div>`;
      messageContainer.appendChild(elem);
    }
    //others send a message
    else if (type == "other") {
      let elem = document.createElement("div");
      elem.setAttribute("class", "message other-message");
      elem.innerHTML = `
      <div>
        <div class="name">${message.username}</div>
        <div class="text">${message.text}</div>
      </div>`;
      messageContainer.appendChild(elem);
    } else if (type == "update") {
      let elem = document.createElement("div");
      elem.setAttribute("class", "update");
      elem.innerText = message;
      messageContainer.appendChild(elem);
    }

    //scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
