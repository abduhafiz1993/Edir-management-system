/**
 * HERE WE HAVE SIDER BAR CONTROLLER CODE
 *
 * */



/*RESPONSING PART */
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
sidebar.style.zIndex = 1000;

window.innerWidth < 750 && sidebar.classList.add("sidebar-closed");
function handleResize() {
  if (window.innerWidth < 750) {
    sidebar.classList.add("sidebar-closed");
  } else {
    sidebar.classList.remove("sidebar-closed");
  }
}

window.addEventListener("resize", handleResize);
const overLay = {
  overlay: document.getElementById("overlay"),
  overlayAdd: (element) => {
    overLay.overlay.classList.add("overlay");
    overLay.overlay.addEventListener("click", () =>
      overLay.overlayRemove(element)
    );
  },
  overlayRemove: (element) => {
    overLay.overlay.classList.remove("overlay");
    element.classList.add("sidebar-closed");
  },
};
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-closed");
  if (
    !sidebar.classList.contains("sidebar-closed") &&
    window.innerWidth < 750
  ) {
    overLay.overlayAdd(sidebar);
  }
});
/*side bar end */

/*|||DATA FETCHING FROM SERVER||| */

/***
 *
 * ||| RENDERING EVENT FROM SERVER |||
 *
 */

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

          const messageTime = document.createElement("div");
          messageTime.classList.add("message-time");
          messageTime.textContent = new Date(message.sent_date).toLocaleString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
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

