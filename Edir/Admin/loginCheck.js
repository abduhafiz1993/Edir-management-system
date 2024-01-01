function checkLoginStatus() {
  if (localStorage.getItem("username")) {
    const username = localStorage.getItem("username");
    const islogin = localStorage.getItem("loginStatus");
    const role = localStorage.getItem("role");

    if (role === "Admin" || role === "admin" || role === "assistant") {
      const check = { username, islogin, role };
      fetch(`http://${URL}:8080/Edir/edir_api/user/login/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(check),
      })
        .then((response) => response.json())
        .then((login) => {
          console.log(login.islogin);
          if (login.islogin && login.role) {
            console.log(" logged in");
          } else {
           
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
     
      //  window.location.href = "/Home page";
    }
  } else {
    
  }
}

checkLoginStatus();
setInterval(checkLoginStatus, 200000);
