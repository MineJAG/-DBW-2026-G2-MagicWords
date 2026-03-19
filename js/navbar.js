"use strict";

fetch("../views/navbar.html")
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    document.getElementById("navbarContainer").innerHTML = data;
  })
