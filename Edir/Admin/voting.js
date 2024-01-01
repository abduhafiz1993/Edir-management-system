function votingPage() {
  closeSideBar();
  setActiveNavLink(document.querySelector(".vote"));
  const mainDashboard = document.querySelector(".main-dashboard");
  mainDashboard.textContent = "";
  mainDashboard.classList.add("setVisible-open");

  const cardDiv = document.createElement("div");
  cardDiv.className = "card mt-5";

  const navElement = document.createElement("nav");
  navElement.className = "navbar navbar-expand-lg navbar-light bg-light";

  const containerDiv = document.createElement("div");
  containerDiv.className = "container";

  const collapseDiv = document.createElement("div");
  collapseDiv.className = "collapse navbar-collapse justify-content-end";

  const ulElement = document.createElement("ul");
  ulElement.className = "navbar-nav";

  const liElement1 = document.createElement("li");
  liElement1.className = "nav-item menu candidate";
  const aElement1 = document.createElement("a");
  aElement1.className = "nav-link";
  aElement1.href = "#Requests";
  aElement1.onclick = getCandidate;
  aElement1.innerHTML = 'Requests <span class="notification-count"></span>';
  liElement1.appendChild(aElement1);

  const liElement2 = document.createElement("li");
  liElement2.className = "nav-item";
  const aElement2 = document.createElement("a");
  aElement2.className = "nav-link menu";
  aElement2.href = "#Initaite_Vote";
  aElement2.onclick = initaiteElection;
  aElement2.textContent = "Start Election";
  liElement2.appendChild(aElement2);

  const liElement3 = document.createElement("li");
  liElement3.className = "nav-item";
  const aElement3 = document.createElement("a");
  aElement3.className = "nav-link";
  aElement3.href = "#End_Vote";
  aElement3.onclick = endElection;
  aElement3.textContent = "End Vote";
  liElement3.appendChild(aElement3);

  const liElement4 = document.createElement("li");
  liElement4.className = "nav-item";
  const aElement4 = document.createElement("a");
  aElement4.className = "nav-link";
  aElement4.href = "#End_Vote";
  aElement4.onclick = electionResult;
  aElement4.textContent = "Result";
  liElement4.appendChild(aElement4);

  ulElement.appendChild(liElement1);
  ulElement.appendChild(liElement2);
  ulElement.appendChild(liElement3);
  ulElement.appendChild(liElement4);

  collapseDiv.appendChild(ulElement);
  containerDiv.appendChild(collapseDiv);
  navElement.appendChild(containerDiv);

  const votingSystemDiv = document.createElement("div");
  votingSystemDiv.className = "voting-system";

  cardDiv.appendChild(navElement);
  cardDiv.appendChild(votingSystemDiv);

  mainDashboard.appendChild(cardDiv);

  // setInterval(synchronizeNotification, 100);
  getCandidate();
  synchronizeNotification();
}
function synchronizeNotification() {
  fetch(`http://${URL}:8080/Edir/edir_api/user/voting`)
    .then((response) => response.json())
    .then((candidate) => {
      const notification = document.querySelectorAll(".notification-count");
      // notification.textContent = "";
      if (candidate && Array.isArray(candidate)) {
        const count = candidate.reduce((acc, cand) => {
          if (cand.accepted === null) {
            return acc + 1;
          }
          return acc;
        }, 0);
        if (count !== 0) {
          notification.forEach((not) => {
            not.textContent = count;
          });
        } else if (count === 0) {
          notification.forEach((not) => {
            not.classList = "hidden";
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
//votingPage();

synchronizeElection();
function getCandidate() {
  fetch(`http://${URL}:8080/Edir/edir_api/user/voting`)
    .then((response) => response.json())
    .then((candidate) => {
      const container = document.querySelector(".voting-system");
      container.textContent = "";
      const headerText = document.createElement("h3");
      headerText.className = "Header-short-line";
      headerText.textContent = "Election requist list";
      const cardHeaderDiv = document.createElement("div");
      cardHeaderDiv.className = "card-header";

      cardHeaderDiv.appendChild(headerText);

      const cardBodyDiv = document.createElement("div");
      cardBodyDiv.className = "card-body cand-requestlist";

      container.appendChild(cardHeaderDiv);
      if (candidate && Array.isArray(candidate) && candidate.length > 0) {
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
          const divButton = document.createElement("div");
          divButton.className = "btn-approval";

          divButton.id = person.username;
          const approveButton = document.createElement("button");
          approveButton.classList.add("btn", "btn-primary");
          approveButton.textContent = "Approve";
          approveButton.addEventListener("click", function () {
            Approve(person.username, true);
          });

          const rejectButton = document.createElement("button");
          rejectButton.classList.add("btn", "btn-danger");
          rejectButton.textContent = "Reject";
          rejectButton.addEventListener("click", function () {
            Approve(person.username, false);
          });

          colDiv.appendChild(candidateNameH2);
          colDiv.appendChild(descriptionDiv);
          colDiv.appendChild(joinedDateDiv);
          colDiv.appendChild(education);

          divButton.appendChild(approveButton);
          divButton.appendChild(rejectButton);

          colDiv.appendChild(divButton);
          alertDiv.appendChild(userProfileDiv);
          alertDiv.appendChild(colDiv);
          cardBodyDiv.appendChild(alertDiv);
          container.appendChild(cardBodyDiv);
          if (person.accepted !== null) {
            const parentDiv = document.getElementById(person.username);
            const buttons = parentDiv.getElementsByTagName("button");
            for (let i = 0; i < buttons.length; i++) {
              buttons[i].disabled = true;
            }
          }
        });
      } else {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert", "alert-warning", "row");
        alertDiv.textContent = "No request yet or Election didn't started";
        cardBodyDiv.appendChild(alertDiv);
        container.appendChild(cardBodyDiv);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  function Approve(username, accepted) {
    const url = `http://${URL}:8080/Edir/edir_api/user/candidate/approval`;
    const vote = {
      username, //candidate username
      accepted,
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
        synchronizeElection();
        const parentDiv = document.getElementById(username);
        const buttons = parentDiv.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
        }
        const msg = document.createElement("span");
        msg.className = " alert alert-success p-2";
        msg.textContent = "Done!!";
        parentDiv.appendChild(msg);
      })
      .catch((er) => {
        console.log(er);
      });
  }
  synchronizeElection();
}
function initaiteElection() {
  const cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.className = "card-header";

  const headerText = document.createElement("h3");
  headerText.className = "Header-short-line";
  headerText.textContent = "Start Election";

  cardHeaderDiv.appendChild(headerText);

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.className = "card-body cand-requestlist";

  const message = document.createElement("h6");
  message.textContent = "If you think that this is election time please ";
  const strong = document.createElement("strong");
  strong.textContent = "click";
  message.appendChild(strong);
  message.insertAdjacentText(
    "beforeend",
    " the below button and start the election for leader"
  );

  const startElectionButton = document.createElement("button");
  startElectionButton.className = "btn btn-primary start-election";
  startElectionButton.addEventListener("click", () => {
    setElection(true);
  });

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-check-to-slot";

  const buttonText = document.createTextNode(" Start Election now");

  startElectionButton.appendChild(icon);
  startElectionButton.appendChild(buttonText);

  cardBodyDiv.appendChild(message);
  cardBodyDiv.appendChild(startElectionButton);

  const container = document.querySelector(".voting-system");
  container.textContent = "";
  container.appendChild(cardHeaderDiv);
  container.appendChild(cardBodyDiv);

  synchronizeElection();
}
function setElection(start) {
  const url = `http://${URL}:8080/Edir/edir_api/user/Election/start`;

  const election = {
    start,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(election),
  })
    .then((response) => response.json())
    .then((election) => {
      if (election.started || election.end) {
        const successModal = document.getElementById("voteModal");
        const bootstrapModal = new bootstrap.Modal(successModal);
        bootstrapModal.show();
        synchronizeElection();
      }
    })
    .catch((err) => {
      console.log(err);
      const successModal = document.getElementById("warningModal");
      const bootstrapModal = new bootstrap.Modal(successModal);
      bootstrapModal.show();
    });
}
function synchronizeElection() {
  const url = "http://localhost:8080/Edir/edir_api/user/Election";
  fetch(url)
    .then((response) => response.json())
    .then((synchronize) => {
      if (synchronize.isElectionTime) {
        const start_election = document.querySelector(".start-election");
        start_election.disabled = true;
      }
      if (!synchronize.candidationTime && synchronize.isElectionTime) {
        const start_election = document.querySelectorAll(".start-candidation");
        if (start_election) {
          start_election.disabled = true;
        } else {
          ///
        }
      } else if (!synchronize.isElectionTime) {
        const endElectionButton = document.querySelector(".end-election");
        if (endElectionButton) {
          endElectionButton.disabled = true;
        } else {
          ///
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function endElection() {
  const cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.className = "card-header";

  const headerText = document.createElement("h3");
  headerText.className = "Header-short-line";
  headerText.textContent = "End Election";

  cardHeaderDiv.appendChild(headerText);

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.className = "card-body cand-requestlist";

  const message = document.createElement("h6");
  message.className = "alert alert-warning";
  message.textContent = "if you think that voting is done click the ";
  const strong = document.createElement("strong");
  strong.textContent = "Button Below";
  message.appendChild(strong);
  message.insertAdjacentText(
    "beforeend",
    " But keep in mind that the result till now will be anaounced to all member and the election end"
  );
  const startElectionButton = document.createElement("button");
  startElectionButton.className = "btn btn-warning end-election";
  startElectionButton.addEventListener("click", () => {
    setElection(false);
  });

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-check-to-slot";

  const buttonText = document.createTextNode(" End Election now");
  startElectionButton.appendChild(icon);
  startElectionButton.appendChild(buttonText);

  cardBodyDiv.appendChild(message);
  cardBodyDiv.appendChild(startElectionButton);

  const container = document.querySelector(".voting-system");
  container.textContent = "";
  container.appendChild(cardHeaderDiv);
  container.appendChild(cardBodyDiv);
  synchronizeElection();
}

function electionResult() {
  const cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.className = "card-header";

  const headerText = document.createElement("h3");
  headerText.className = "Header-short-line";
  headerText.textContent = "Election Result";

  cardHeaderDiv.appendChild(headerText);

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.className = "card-body cand-requestlist";

  const message = document.createElement("h6");
  message.className = "alert alert-secondary";
  message.textContent =
    "if you want to anounce and see the winner of the election pls click the below button ";

  const startElectionButton = document.createElement("button");
  startElectionButton.className = "btn btn-primary end-election";
  startElectionButton.addEventListener("click", () => {
    checkResultNow();
  });
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-check-to-slot";

  const buttonText = document.createTextNode(" End Election now");

  startElectionButton.appendChild(icon);
  startElectionButton.appendChild(buttonText);

  cardBodyDiv.appendChild(message);
  cardBodyDiv.appendChild(startElectionButton);

  const container = document.querySelector(".voting-system");
  container.textContent = "";
  container.appendChild(cardHeaderDiv);
  container.appendChild(cardBodyDiv);
  synchronizeElection();
}
