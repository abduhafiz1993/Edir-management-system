function addMember() {
  const input = {};

  function handleChange() {
    const name = event.target.name;
    const value = event.target.value;
    input[name] = value;
  }
  closeSideBar();
  const mainDashboard = document.querySelector(".main-dashboard");
  mainDashboard.classList.add("setVisible-open");
  mainDashboard.innerHTML = "";
  const addMemberForm = document.createElement("div");
  addMemberForm.classList.add("addMemberForm");

  const header = document.createElement("h1");
  header.className = "font-bold text-3xl Header-short-line";
  header.textContent = "User Registration";
  addMemberForm.appendChild(header);

  const form = document.createElement("form");
  form.id = "form";
  form.method = "POST";
  form.addEventListener("submit", () => {
    handleSubmit(`http://${URL}:8080/Edir/Edir_api/user/save`, input);
  });
  form.classList.add("registration-form");
  addMemberForm.appendChild(form);

  const createInputField = (
    labelText,
    type,
    id,
    name,
    placeholder,
    isRequired
  ) => {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    form.appendChild(label);

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = name;
    input.placeholder = placeholder;
    input.addEventListener("change", () => {
      handleChange();
    });
    if (isRequired) {
      input.required = true;
    }
    form.appendChild(input);

    form.appendChild(document.createElement("br"));
  };

  createInputField(
    "First Name:",
    "text",
    "fname",
    "fname",
    "Enter First name",
    true
  );
  createInputField(
    "Last Name:",
    "text",
    "lname",
    "lname",
    "Enter Last name",
    true
  );

  const sexLabel = document.createElement("label");
  sexLabel.htmlFor = "sex";
  sexLabel.textContent = "Gender:";

  form.appendChild(sexLabel);

  const sexSelect = document.createElement("select");
  sexSelect.id = "sex";
  sexSelect.name = "sex";
  sexSelect.addEventListener("change", handleChange);
  form.appendChild(sexSelect);

  const selectOption = document.createElement("option");
  selectOption.textContent = "select";
  sexSelect.appendChild(selectOption);

  const maleOption = document.createElement("option");
  maleOption.value = "male";
  maleOption.textContent = "Male";
  sexSelect.appendChild(maleOption);

  const femaleOption = document.createElement("option");
  femaleOption.value = "female";
  femaleOption.textContent = "Female";
  sexSelect.appendChild(femaleOption);

  form.appendChild(document.createElement("br"));

  createInputField("Email:", "email", "email", "email", "Enter email", true);
  createInputField(
    "Phone Number:",
    "tel",
    "phoneNumber",
    "phoneNumber",
    "Enter Phone number",
    true
  );
  createInputField("Password:", "password", "password", "password", "", true);
  createInputField(
    "Address:",
    "text",
    "address",
    "address",
    "Enter Address name",
    true
  );

  const birthdateLabel = document.createElement("label");
  birthdateLabel.htmlFor = "birthdate";
  birthdateLabel.textContent = "Birthdate:";

  form.appendChild(birthdateLabel);

  const birthdateInput = document.createElement("input");
  birthdateInput.type = "date";
  birthdateInput.id = "birthdate";
  birthdateInput.name = "birthdate";
  birthdateInput.required = true;
  birthdateInput.addEventListener("change", handleChange);
  form.appendChild(birthdateInput);

  form.appendChild(document.createElement("br"));

  const roleLabel = document.createElement("label");
  roleLabel.htmlFor = "role";
  roleLabel.textContent = "Role:";
  form.appendChild(roleLabel);

  const roleSelect = document.createElement("select");
  roleSelect.id = "role";
  roleSelect.name = "role";
  roleSelect.addEventListener("change", handleChange);
  form.appendChild(roleSelect);

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select Role";
  roleSelect.appendChild(defaultOption);

  const adminOption = document.createElement("option");
  adminOption.value = "admin";
  adminOption.textContent = "Admin";
  roleSelect.appendChild(adminOption);

  const assistantOption = document.createElement("option");
  assistantOption.value = "assistant";
  assistantOption.textContent = "Assistant";
  roleSelect.appendChild(assistantOption);

  const memberOption = document.createElement("option");
  memberOption.value = "member";
  memberOption.textContent = "Member";
  roleSelect.appendChild(memberOption);

  const submitButton = document.createElement("button");
  submitButton.classList.add("btn", "btn-primary");
  submitButton.type = "submit";
  submitButton.textContent = "Submit";
  form.appendChild(submitButton);

  mainDashboard.append(addMemberForm);
  setActiveNavLink(document.querySelector(".add-member"));
}

function listMember() {
  setActiveNavLink(document.querySelector(".list-member"));
  closeSideBar();
  const mainDashboard = document.querySelector(".main-dashboard");
  mainDashboard.classList.add("setVisible-open");
  mainDashboard.textContent = "";

  const memberList = document.createElement("div");
  memberList.setAttribute("class", "card memberList");

  const table = document.createElement("table");
  table.setAttribute("class", "table table-hover");

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  ///ACTION ON USER
  //DELETE AND EDIT
  const Action = {
    DeleteUser: (user) => {
      const url = `http://${URL}:8080/Edir/Edir_api/${user["username"]}`;
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            listMember();
            const successModal = document.getElementById("successModal");
            const bootstrapModal = new bootstrap.Modal(successModal);
            bootstrapModal.show();
          }
        })
        .catch((error) => {
          console.error("Error occurred while deleting user:", error);
        });
    },
  };
  //CREATING ACTION BUTTONS

  const actionButton = {
    deleteButton: (user) => {
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "btn btn-danger");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        Action.DeleteUser(user);
      });
      return deleteButton;
    },
    editButton: (user) => {
      const editButton = document.createElement("button");
      editButton.setAttribute("class", "btn btn-secondary");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        EditMember(user);
      });
      return editButton;
    },
    selectButton: (user) => {
      const submitButton = document.createElement("button");
      submitButton.setAttribute("class", "btn btn-primary");
      submitButton.textContent = "Promote";
      submitButton.addEventListener("click", () => {
        EditMember(user);
      });
      const div = document.createElement("div");
      div.setAttribute("class", "promote");
      div.appendChild(submitButton);
      return div;
    },
  };

  getUserData()
    .then((data) => {
      if (data && Array.isArray(data)) {
        // Add table headers
        const headers = [];
        headers.push("No");
        Object.keys(data[0]).forEach((key) => {
          if (key !== "profilePic") {
            headers.push(key);
          }
        });
        headers.push("Action");
        const validHeaders = headers.filter(
          (header) => header !== "id" && header !== "password"
        );

        validHeaders.forEach((header) => {
          let headerText = header;
          if (header === "birthdate") {
            headerText = "Age";
          }
          const th = createColumn(headerText, "th");
          tr.appendChild(th);
        });

        // Add table rows
        const tbody = document.createElement("tbody");
        n = 1;
        data.forEach((user) => {
          const row = document.createElement("tr");

          validHeaders.forEach((header) => {
            let cellData = user[header];
            if (header === "No") {
              cellData = n;
            }
            if (header === "birthdate") {
              const age = calculateAge(user[header]);
              cellData = age;
            }
            if (header === "Action") {
              const deleteButton = actionButton.deleteButton(user);
              const editButton = actionButton.editButton(user);
              const selectButton = actionButton.selectButton(user);
              const actionDiv = document.createElement("div");
              actionDiv.setAttribute("class", "action");
              actionDiv.appendChild(deleteButton);
              actionDiv.appendChild(editButton);
              actionDiv.appendChild(selectButton);
              const td = document.createElement("td");
              td.append(actionDiv);
              row.appendChild(td);
            }
            if (header !== "Action") {
              const td = createColumn(cellData, "td", user);
              row.appendChild(td);
            } else {
              const td = createColumn(cellData, "td");
              row.appendChild(td);
            }
          });
          n += 1;
          tbody.appendChild(row);
        });

        thead.appendChild(tr);
        table.appendChild(thead);
        table.appendChild(tbody);
        memberList.appendChild(table);
        mainDashboard.appendChild(memberList);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  // User edit

  // Create column with data
  const createColumn = (data, tag, user) => {
    const Tag = document.createElement(tag);
    Tag.textContent = data;
    Tag.addEventListener("click", () => {
      MemberDetail(user);
    });
    return Tag;
  };

  // Calculate age based on birthdate
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  function getUserData() {
    const url = `http://${URL}:8080/Edir/edir_api/user/save`;
    return fetch(url).then((response) => response.json());
  }
}
