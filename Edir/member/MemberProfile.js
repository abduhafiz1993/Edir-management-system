
function EditMember(user) {
  window.location.href = "#" + user.username;
  document.title = user.username + " Editing";
  const container = document.querySelector(".memberProfile");
  container.innerHTML = ` <div class="card">
           <div class="card-header">
             <h5 class="Header-short-line">Member profile</h5>
           </div>
           <div class="registration-form">
             <form id="userForm">
               <div class="form-group">
                 <label for="firstName">First Name</label>
                 <input
                   type="text"
                   class="form-control"
                   id="firstName"
                   placeholder="First Name"
                 />
               </div>
               <div class="form-group">
                 <label for="lastName">Last Name</label>
                 <input
                   type="text"
                   class="form-control"
                   id="lastName"
                   placeholder="Last Name"
                 />
               </div>
               <div class="form-group">
                 <label for="email">Email</label>
                 <input
                   type="email"
                   class="form-control"
                   id="email"
                   placeholder="Email"
                 />
               </div>
               <div class="form-group">
                 <label for="phoneNumber">Phone Number</label>
                 <input
                   type="tel"
                   class="form-control"
                   id="phoneNumber"
                   placeholder="Phone Number"
                 />
               </div>
               <div class="form-group">
                 <label for="address">Address</label>
                 <input
                   type="text"
                   class="form-control"
                   id="address"
                   placeholder="Address"
                 />
               </div>
               <div class="form-group">
                 <label for="birthdate">Birth Date</label>
                 <input type="date" class="form-control" id="birthdate" />
               </div>
     
               <input type="file" id="fileInput" name="profilepic"accept="image/*" />
               <button type="submit" class="btn btn-primary">Submit</button>
             </form>
           </div>
         </div>`;
  document.getElementById("firstName").value = user.fname;
  document.getElementById("lastName").value = user.lname;
  document.getElementById("email").value = user.email;
  document.getElementById("phoneNumber").value = user.phoneNumber;
  document.getElementById("address").value = user.Address;
  document.getElementById("birthdate").value = user.birthdate;
  document
    .getElementById("userForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting

      // Update the user object with the form input values
      user.fname = document.getElementById("firstName").value;
      user.lname = document.getElementById("lastName").value;
      user.email = document.getElementById("email").value;
      user.phoneNumber = document.getElementById("phoneNumber").value;
      user.address = document.getElementById("address").value;
      user.birthdate = document.getElementById("birthdate").value;
      user.role = document.getElementById("role").value;

      // Display the updated user object in the console
      handleSubmit(`http://${URL}:8080/Edir/Edir_api/user/save`, user);
    });

  var fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", () => {
    uploadImage();
  });
  function uploadImage() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append("image", file);
    formData.append("username", user.username);
  

    fetch(`http://${URL}:8080/Edir/Edir_api/user/save`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        const successModal = document.getElementById("successModal");
        const bootstrapModal = new bootstrap.Modal(successModal);
        bootstrapModal.show();
        
        // Handle the response or update the UI as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  }
}
// User data
function MemberDetail(user) {
  window.location.href = "#" + user.username;
  document.title = user.fname + " " + user.lname + " profile detail";
  const container = document.querySelector(".memberProfile");
  container.textContent = "";

  const card = document.createElement("div");
  card.classList.add("card");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const cardHeaderTitle = document.createElement("h5");
  cardHeaderTitle.classList.add("Header-short-line");
  cardHeaderTitle.textContent = user.fname + " " + user.lname;
  cardHeader.appendChild(cardHeaderTitle);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "user-detail", "m-auto");

  const profilePicture = document.createElement("div");
  profilePicture.classList.add("profile-picture", "m-auto");
  const profileImage = document.createElement("img");
  profileImage.src = "../Edir_api/pic/" + user.profilePic;

  profileImage.alt = "Profile Picture";
  profilePicture.appendChild(profileImage);

  const table = document.createElement("table");

  const data = [
    { label: "Name:", value: user.fname + " " + user.lname },
    { label: "username:", value: user.username },
    { label: "Sex:", value: user.sex },
    { label: "Email:", value: user.email },
    { label: "Role:", value: user.role },
    { label: "phoneNumber:", value: user.phoneNumber },
    { label: "address:", value: user.Address },
    { label: "Email:", value: "tola@gma.com" },
    { label: "Joined Date:", value: user.joinedDate },
  ];

  data.forEach((item) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.classList = "p-lg-2 border-bottom";
    const valueCell = document.createElement("td");
    valueCell.classList = "p-lg-2 border-bottom";
    labelCell.textContent = item.label;
    valueCell.textContent = item.value;
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  });

  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn-secondary");
  editButton.textContent = "Edit";

  editButton.addEventListener("click", () => {
    EditMember(user);
  });
  const logoutBtn = document.createElement("button");
  logoutBtn.classList = "btn btn-warning";
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent="Logout"
  logoutBtn.addEventListener("click", () => {
    logout();
  });

  cardBody.appendChild(profilePicture);
  cardBody.appendChild(table);
  cardBody.appendChild(editButton);
  cardBody.appendChild(logoutBtn);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  container.appendChild(card);
} // Populate form fields with user data

function logout() {
  localStorage.removeItem("username");
  window.location.href = "/Landing/";
}
