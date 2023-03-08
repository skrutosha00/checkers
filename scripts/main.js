if (!localStorage.getItem("balance_ch")) {
  localStorage.setItem("balance_ch", 500);
}

document.querySelector(".balance").innerHTML =
  localStorage.getItem("balance_ch");

window.onload = () => {
  document.querySelector(".wrapper").classList.remove("hidden");
};
