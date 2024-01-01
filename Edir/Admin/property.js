function propertyList() {
  window.location.href = "#Property";
  document.title = "Property";
  const container = document.querySelector(".main-dashboard");
  container.innerHTML = `
  <div class="container">
      <h1 class='font-bold text-3xl Header-short-line'>Data Display</h1>
      <button class="btn btn-secondary" onclick="addProperty()">Add new </button>
      <table class="table table-hover table-light">
        <thead>
          <tr>
            <th>No</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Bought Date</th>
          </tr>
        </thead>
        <tbody id="table-body"></tbody>
      </table>
    </div>
  `;
  fetch(`http://${URL}:8080/Edir/edir_api/property`)
    .then((response) => response.json())
    .then((data) => {
      // Generate table rows dynamically
      let tableBody = document.getElementById("table-body");
      let rowNumber = 1;
      data.forEach((item) => {
        let row = document.createElement("tr");
        row.innerHTML = `
      <td>${rowNumber++}</td>
      <td><img src="../Edir_api/pic/${
        item.picName
      }" alt="Picture" width="50"></td>
      <td>${item.propertName}</td>
      <td>${item.boughtDate}</td>
    `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

function addProperty() {
  window.location.href = "#Property";
  document.title = "Property Add";
  const container = document.querySelector(".main-dashboard");
  container.innerHTML = ` <div class="container">
    <div class="card">
    <h1 class='font-bold text-3xl Header-short-line'>Add new property</h1>
      <form class="p-3 propertAdd" id="addProperty">
        <div class="form-group">
          <label for="boughtDate">Bought Date</label>
          <input
            type="date"
            class="form-control"
            id="boughtDate"
            name="boughtDate"
          />
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" id="name" name="name" />
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input
            type="number"
            class="form-control"
            id="quantity"
            name="quantity"
          />
        </div>
        <div class="form-group">
          <label for="file">File</label>
          <input
            type="file"
            class="form-control-file"
            id="file"
            name="file"
          />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>`;
  const form = document.getElementById("addProperty");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(form);

    fetch(`http://${URL}:8080/Edir/edir_api/property`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
