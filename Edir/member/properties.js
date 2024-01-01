function propertyList() {
    window.location.href = "#Property";
    document.title = "Property";
    const container = document.querySelector(".property-list");
    container.innerHTML = `
      <div class="container">
        <h1 class='font-bold text-3xl Header-short-line'>Data Display</h1>
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
        const tableBody = document.getElementById("table-body");
        let rowNumber = 1;
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${rowNumber++}</td>
            <td><img src="../Edir_api/pic/${item.picName}" alt="Picture" width="50"></td>
            <td>${item.propertName}</td>
            <td>${item.boughtDate}</td>
          `;
          tableBody.append(row);
        });
      })
      .catch((error) => console.error(error));
  }
  