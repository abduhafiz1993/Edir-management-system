function Events() {
    closeSideBar();
    getEvent();
    setInterval(getEvent, 500);
    const mainDashboard = document.querySelector(".main-dashboard");
    
    mainDashboard.classList.add("setVisible-open");
    mainDashboard.textContent = "";
    const container = document.createElement("div");
    container.className = "container Event-app";

    const card = document.createElement("div");
    card.classList.add("card");
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const headerText = document.createElement("h5");
    headerText.classList.add("Header-short-line");
    headerText.textContent = "Ginjo Edir Event notification";

    cardHeader.appendChild(headerText);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.classList.add("sender-chat");
    cardBody.setAttribute("id", "chatContainer");
    const readerChat = document.createElement("div");
    readerChat.classList.add("readerChat");

    const form = document.createElement("form");
    form.method = "POST";
    form.onsubmit = handleEventMsg;

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.onchange = handleChangeMsg;
    inputField.classList.add("form-control");
    inputField.setAttribute("id", "msg-input");
    inputField.name = "message";
    inputField.placeholder = "Type your message...";

    const inputGroupAppend = document.createElement("div");
    inputGroupAppend.classList.add("input-group-append");

    const sendButton = document.createElement("button");
    sendButton.classList.add("btn", "btn-primary", "m-0");

    if (inputField.value === "" && inputField.value.length < 3) {
      sendButton.disabled = true;
    }

    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") {
        if (inputField.value.length <= 2) {
          sendButton.disabled = true;
        } 
      }
       else {
        sendButton.disabled = false;
      }
    });
    sendButton.type = "submit";
    sendButton.textContent = "Send";

    inputGroup.appendChild(inputField);
    inputGroupAppend.appendChild(sendButton);
    inputGroup.appendChild(inputGroupAppend);

    form.appendChild(inputGroup);

    cardBody.appendChild(readerChat);
    cardBody.appendChild(form);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    container.appendChild(card);

    mainDashboard.appendChild(container);
    function scrollToBottom() {
      const chatContainer = document.getElementById("chatContainer");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const interval = setInterval(scrollToBottom, 100);

    setTimeout(() => {
      clearInterval(interval);
    }, 100);
    setActiveNavLink(document.querySelector(".events"));
  }

//setInterval(getEvent,500)
const eventMsg = {};

function handleChangeMsg() {
  const name = event.target.name;
  const value = event.target.value;
  eventMsg[name] = value;
}

function handleEventMsg() {
  event.preventDefault(); // Prevent form submission
  const inputms = document.getElementById("msg-input");
  const url = `http://${URL}:8080/Edir/edir_api/user/Event`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventMsg),
  })
    .then((response) => response.json())
    .then((result) => {
      inputms.value = "";
      eventMsg[inputms.name] = null;
      // Handle the API response
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle any errors
    });
}