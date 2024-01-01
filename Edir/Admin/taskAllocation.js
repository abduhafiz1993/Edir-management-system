function taskAllocation() {
    setActiveNavLink(document.querySelector(".task"));
    closeSideBar();
    const input = {};
    const mainDashboard = document.querySelector(".main-dashboard");

    mainDashboard.classList.add("setVisible-open");
    mainDashboard.textContent = "";
    const card = document.createElement("div");
    card.className = "card";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    const headerText = document.createElement("h5");
    headerText.className = "Header-short-line";
    headerText.textContent = "Ginjo Edir Task Allocation";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body task-allocation";

    cardHeader.appendChild(headerText);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    mainDashboard.appendChild(card);
    createTaskNum();
    function createTaskNum() {
      const taskAllocation = document.querySelector(".task-allocation");
      const form = document.createElement("form");
      form.addEventListener("submit", handleFormSubmit);

      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");

      const label = document.createElement("label");
      label.setAttribute("for", "taskNo");
      label.textContent = "Enter Number of task/tasks:";

      const inputGroup = document.createElement("div");
      inputGroup.classList.add("input-group");

      const inputField = document.createElement("input");
      inputField.setAttribute("id", "taskNo");
      inputField.setAttribute("type", "number");
      inputField.classList.add("form-control");
      inputField.setAttribute(
        "placeholder",
        "How many tasks you want to allocate for this event"
      );

      const inputGroupAppend = document.createElement("div");
      inputGroupAppend.classList.add("input-group-append");

      const submitButton = document.createElement("button");
      submitButton.classList.add("btn", "btn-primary", "m-0");
      submitButton.setAttribute("type", "submit");
      submitButton.textContent = "Next";

      formGroup.appendChild(label);
      inputGroup.appendChild(inputField);
      inputGroupAppend.appendChild(submitButton);
      inputGroup.appendChild(inputGroupAppend);
      formGroup.appendChild(inputGroup);
      form.appendChild(formGroup);
      taskAllocation.prepend(form);

      function handleFormSubmit(event) {
        event.preventDefault();

        const taskNoInput = document.getElementById("taskNo");
        const numberOfTasks = taskNoInput.value;
        for (let i = 1; i <= numberOfTasks; i++) {
          createTask(i);
        }
        taskNoInput.value = "";
      }
    }

    function createTask(n) {
      const taskAllocation = document.querySelector(".task-allocation");

      const tasksDiv = document.createElement("div");
      tasksDiv.classList.add("tasks");
      //
      const taskHeader = document.createElement("h6");
      taskHeader.classList.add("Header-short-line");
      taskHeader.textContent = "Task " + n;

      const taskForm = document.createElement("form");
      taskForm.addEventListener("submit", () => {
        handleSubmit(`http://${URL}:8080/Edir/edir_api/user/Task`, input);
      });

      const taskCreatingDiv = document.createElement("div");
      taskCreatingDiv.classList.add("task-creating");

      const taskTitleInput = document.createElement("input");
      taskTitleInput.id = "taskTitle";
      taskTitleInput.required = true;
      taskTitleInput.type = "text";
      taskTitleInput.classList.add("form-control");
      taskTitleInput.placeholder = "Enter task title";
      taskTitleInput.name = "taskTitle";
      taskTitleInput.addEventListener("change", handleChange);
      const taskLocationInput = document.createElement("input");
      taskLocationInput.id = "taskLocation";
      taskLocationInput.required = true;
      taskLocationInput.type = "text";
      taskLocationInput.classList.add("form-control");
      taskLocationInput.placeholder = "Enter task title";
      taskLocationInput.name = "location";
      taskLocationInput.addEventListener("change", handleChange);

      const taskTitleLabel = document.createElement("label");
      taskTitleLabel.setAttribute("for", "taskLocation");
      taskTitleLabel.textContent = "Task Title:";

      const taskLocationLabel = document.createElement("label");
      taskLocationLabel.setAttribute("for", "taskLocation");
      taskLocationLabel.textContent = "Task Location:";

      taskCreatingDiv.appendChild(taskTitleLabel);
      taskCreatingDiv.appendChild(taskTitleInput);
      taskCreatingDiv.appendChild(taskLocationLabel);
      taskCreatingDiv.appendChild(taskLocationInput);

      const numberOfPersonsInput = document.createElement("input");
      numberOfPersonsInput.id = "numberOfPersons";
      numberOfPersonsInput.required = true;
      numberOfPersonsInput.name = "numberOfPersons";
      numberOfPersonsInput.type = "number";
      numberOfPersonsInput.classList.add("form-control");
      numberOfPersonsInput.placeholder = "Enter number of persons/force";
      numberOfPersonsInput.addEventListener("change", handleChange);

      const numberOfPersonsLabel = document.createElement("label");
      numberOfPersonsLabel.setAttribute("for", "numberOfPersons");
      numberOfPersonsLabel.textContent = "Number of Persons/Force:";

      taskCreatingDiv.appendChild(numberOfPersonsLabel);
      taskCreatingDiv.appendChild(numberOfPersonsInput);

      const startingTimeInput = document.createElement("input");
      startingTimeInput.id = "startingTime";
      startingTimeInput.required = true;
      startingTimeInput.type = "datetime-local";
      startingTimeInput.name = "startingTime";
      startingTimeInput.addEventListener("change", handleChange);
      startingTimeInput.classList.add("form-control");

      const startingTimeLabel = document.createElement("label");
      startingTimeLabel.setAttribute("for", "startingTime");
      startingTimeLabel.textContent = "Starting Time and Date:";

      taskCreatingDiv.appendChild(startingTimeLabel);
      taskCreatingDiv.appendChild(startingTimeInput);

      const allocateButton = document.createElement("button");
      allocateButton.type = "submit";
      allocateButton.classList.add("btn", "btn-primary");
      allocateButton.textContent = "Allocate";

      taskForm.appendChild(taskCreatingDiv);
      taskForm.appendChild(allocateButton);

      tasksDiv.appendChild(taskHeader);
      tasksDiv.appendChild(taskForm);
      taskAllocation.append(tasksDiv);
    }


    function handleChange() {
      const name = event.target.name;
      const value = event.target.value;
      input[name] = value;
    } 
  }
