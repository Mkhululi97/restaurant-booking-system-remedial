const errorEl = document.querySelector(".is-danger");
const successEl = document.querySelector(".is-success");
if (errorEl.innerText.length > 0) {
  errorEl.classList.remove("hidden");
}
if (successEl.innerText.length > 0) {
  successEl.classList.remove("hidden");
}
setTimeout(function () {
  errorEl.innerText = "";
  errorEl.classList.add("hidden");
  successEl.innerText = "";
  successEl.classList.add("hidden");
}, 2500);
