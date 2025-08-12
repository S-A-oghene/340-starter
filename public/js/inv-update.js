"use strict";

const form = document.querySelector("#updateForm");
form.addEventListener("input", function () {
    const updateBtn = document.querySelector("#updateForm button");
  updateBtn.removeAttribute("disabled");
});
