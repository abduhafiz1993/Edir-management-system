const input = {};

function handleChange() {
  const name = event.target.name;
  const value = event.target.value;
  input[name] = value;
}

function handleSubmit(url, input) {
  event.preventDefault();
   //url = "http://localhost:8080/Edir/Edir_api/user/save";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
    .then((response) => response.json())
    .then((result) => {
      const successModal = document.getElementById("successModal");
      const bootstrapModal = new bootstrap.Modal(successModal);
      bootstrapModal.show();
      // Handle the API response
    })
    .catch((error) => {
      console.error("Error:", error);
      const successModal = document.getElementById("warningModal");
      const bootstrapModal = new bootstrap.Modal(successModal);
      bootstrapModal.show();
      // Handle any errors
    });
}
