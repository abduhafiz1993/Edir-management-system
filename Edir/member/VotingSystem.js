function handleVoteChange() {
  const name = event.target.name;
  const value = event.target.value;
  inputVote[name] = value;
}
const inputVote = {};

inputVote["username"] = username;

function getCandidate() {
  synchronizeVoteNotification();
  fetch(`http://${URL}:8080/Edir/edir_api/user/voting/votable`)
    .then((response) => response.json())
    .then((candidate) => {
      const container = document.querySelector(".candidate-list");
      container.textContent = "";
      const cardBodyDiv = document.createElement("div");
      cardBodyDiv.className = "card-body cand-requestlist";
      if (candidate && Array.isArray(candidate)) {
        candidate.forEach((person) => {
          const alertDiv = document.createElement("div");
          alertDiv.classList.add("alert", "alert-primary", "row");
          const userProfileDiv = document.createElement("div");
          userProfileDiv.classList.add("col-2", "userProfile");
          const userProfileImg = document.createElement("img");
          userProfileImg.classList.add("userProfile");
          userProfileImg.src = "../Edir_api/pic/" + person.profilePic;
          userProfileImg.alt = "";
          userProfileDiv.appendChild(userProfileImg);

          const colDiv = document.createElement("div");
          colDiv.classList.add("col");
          const candidateNameH2 = document.createElement("h2");
          candidateNameH2.classList.add("candidate-name");
          candidateNameH2.textContent = person.fname + " " + person.lname;
          const descriptionDiv = document.createElement("div");
          descriptionDiv.textContent = person.letter;
          const joinedDateDiv = document.createElement("div");
          joinedDateDiv.innerHTML = "<b>Joined date:</b> " + person.joinedDate;
          const education = document.createElement("div");
          education.innerHTML = "<b>Education:</b> " + person.education;

          const voteButton = document.createElement("button");
          voteButton.classList.add("btn", "btn-primary", "vote-btn");
          voteButton.textContent = "vote";
          voteButton.addEventListener("click", function () {
            voteNow(person.username, username);

            synchronizeVote(username);
          });

          colDiv.appendChild(candidateNameH2);
          colDiv.appendChild(descriptionDiv);
          colDiv.appendChild(joinedDateDiv);
          colDiv.appendChild(education);

          colDiv.appendChild(voteButton);
          alertDiv.appendChild(userProfileDiv);
          alertDiv.appendChild(colDiv);
          cardBodyDiv.appendChild(alertDiv);
          container.appendChild(cardBodyDiv);
        });
      } else {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert", "alert-warning", "row");
        alertDiv.textContent = "Election time passed or not started yet";
        cardBodyDiv.appendChild(alertDiv);
        container.appendChild(cardBodyDiv);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  function voteNow(username, votee) {
    const url = `http://${URL}:8080/Edir/edir_api/user/voting`;
    const vote = {
      username, //candidate username
      votee,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vote),
    })
      .then((response) => response.json())
      .then((task) => {
        const successModal = document.getElementById("successModal");
        const bootstrapModal = new bootstrap.Modal(successModal);
        bootstrapModal.show();
      })
      .catch((er) => {
        console.log(er);
      });
  }
  synchronizeVote(username)
}
synchronizeVoteNotification();
function synchronizeVoteNotification() {
  fetch(`http://${URL}:8080/Edir/edir_api/user/voting`)
    .then((response) => response.json())
    .then((candidate) => {
      const notification = document.querySelectorAll(
        ".voting_notification_count"
      );
      notification.textContent = "";
      if (candidate && Array.isArray(candidate)) {
        const count = candidate.reduce((acc, cand) => {
          if (cand.accepted === null) {
            return acc + 1;
          }
          return acc;
        }, 0);
        if (count !== 0) {
          notification.forEach((not) => {
            not.textContent = "";
          });
        } else if (count === 0) {
          notification.forEach((not) => {
            not.style.display = "none";
          });
        } else {
          notification.forEach((not) => {
            not.style.display = "none";
          });
        }
      } else {
        notification.forEach((not) => {
          not.style.display = "none";
        });
      }
    })
    .catch((er) => {
      console.log(er);
    });
}

function synchronizeVote(username) {
  const inputVote = {
    username,
  };
  const url = `http://${URL}:8080/Edir/edir_api/user/voting/check`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputVote),
  })
    .then((responce) => responce.json())
    .then((res) => {
      if (res.voted) {
        const vbtn = document.querySelectorAll(".vote-btn");
        vbtn.forEach((btn) => {
          btn.disabled = true;
        });
      } else {
        console.log("you vote now");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function voteSubmit() {
  event.preventDefault();
  const url = `http://${URL}:8080/Edir/edir_api/user/candidate`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputVote),
  })
    .then((response) => response.json())
    .then((result) => {
      const successModal = document.getElementById("successModal");
      const bootstrapModal = new bootstrap.Modal(successModal);
      bootstrapModal.show();
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle any errors
      const successModal = document.getElementById("warningModal");
      const bootstrapModal = new bootstrap.Modal(successModal);
      bootstrapModal.show();
    });
}
