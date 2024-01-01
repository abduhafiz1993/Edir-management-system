function Events() {
  setInterval(getEvent, 500);
  const memberHome = document.querySelector(".member");
  memberHome.textContent = "";

  const container = document.createElement("div");
  container.className = "container ";
  const card = document.createElement("div");
  card.className = "card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const headerText = document.createElement("h5");
  headerText.className = "Header-short-line";
  headerText.textContent = "Ginjo Edir Event notification";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  cardBody.classList.add("sender-chat");
  cardBody.setAttribute("id", "chatContainer");

  const readerChat = document.createElement("div");
  readerChat.className = "readerChat";

  cardHeader.appendChild(headerText);
  card.appendChild(cardHeader);
  cardBody.appendChild(readerChat);

  card.appendChild(cardBody);
  container.appendChild(card);
  memberHome.appendChild(container);
  function scrollToBottom() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  const interval = setInterval(scrollToBottom, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, 100);
  getEvent();
  synchronizeEvent(username);
}

function getEvent() {
  const url = `http://${URL}:8080/Edir/edir_api/user/Event`;
  fetch(url)
    .then((response) => response.json())
    .then((chat) => {
      if (chat && Array.isArray(chat)) {
        const readerChat = document.querySelector(".readerChat");
        readerChat.textContent = "";
        chat.forEach((message) => {
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("alert", "alert-primary");
          messageDiv.setAttribute("role", "alert");
          messageDiv.textContent = message.message;
          messageDiv.addEventListener("mouseenter", () => {
            markMessageSeen(message.id, username);
          });
          const messageTime = document.createElement("div");
          messageTime.classList.add("message-time");
          messageTime.textContent = new Date(message.sent_date).toLocaleString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric"
            }
          );

          messageDiv.appendChild(messageTime);
          readerChat.appendChild(messageDiv);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching chat information:", error);
    });
}

function markMessageSeen(msgId, username) {
  const requestBody = {
    username: username,
    msg_id: msgId,
  };

  fetch(`http://${URL}:8080/Edir/edir_api/user/Event/seen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.text())
    .then((result) => {
      synchronizeEvent(username);
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}

function showNotification(title, body) {
  // Check if the browser supports notifications
  if ("Notification" in window) {
    // Request permission to show notifications
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        // Create a new notification
        var notification = new Notification(title, { body: body });
      }
    });
  }
}
