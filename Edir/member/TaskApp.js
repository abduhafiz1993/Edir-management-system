function myTask() {
  const url = `http://${URL}:8080/Edir/edir_api/user/Task/mytask`;
  const input = {
    username,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
    .then((response) => response.json())
    .then((task) => {
      const myTask = document.querySelector(".my-task");
      myTask.textContent = "";
      if (task && Array.isArray(task)) {
        task.forEach((tsk) => {
          const alertDiv = document.createElement("div");
          alertDiv.className = "alert alert-primary row-cols-2";

          const elements = [
            { label: "<u>Title: </u>", value: tsk.title },
            { label: "<u>Location: </u>", value: tsk.location },
            { label: "<u>Time: </u>", value: tsk.time },
          ];

          elements.forEach(({ label, value }) => {
            const labelElement = document.createElement("b");
            labelElement.innerHTML = label;

            const valueElement = document.createElement("span");
            valueElement.innerHTML = value;

            alertDiv.appendChild(labelElement);
            alertDiv.appendChild(valueElement);
            alertDiv.appendChild(document.createElement("br"));
          });

          const messageTimeElement = document.createElement("div");
          messageTimeElement.className = "message-time";
          messageTimeElement.innerHTML = "12:00 12/23/2023";
          alertDiv.appendChild(messageTimeElement);

          const buttons = [
            {
              className: "btn btn-primary",
              text: "Available for this task",
            },
            {
              className: "btn btn-secondary",
              text: "I'm busy for this task",
            },
          ];
          buttons.forEach(({ className, text }) => {
            const button = document.createElement("button");
            if (tsk.seen) {
              button.disabled = true;
            }
            button.className = className;
            button.innerHTML = text;
            button.addEventListener("click", () => {
              const seen = true;
              const user_id = tsk.user_id;
              const id = tsk.id;
              const input = {
                user_id,
                seen,
                id,
              };
              fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
              })
                .then((response) => response.json())
                .then((res) => {
                  const successModal = document.getElementById("successModal");
                  const bootstrapModal = new bootstrap.Modal(successModal);
                  bootstrapModal.show();
                })
                .catch((err) => {
                  const successModal = document.getElementById("successModal");
                  const bootstrapModal = new bootstrap.Modal(successModal);
                  bootstrapModal.show();
                  console.log(err);
                });
              setInterval(myTask(), 100);
              synchronizeTaskNotification();
            });
            alertDiv.appendChild(button);
          });
          myTask.append(alertDiv);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  synchronizeTaskNotification();
}
// synchronizeTaskNotification();
