function animateOnce(selector, animClass = "anim") {
  for (let node of document.querySelectorAll(selector)) {
    node.classList.add(animClass);
    setTimeout(() => {
      node.classList.remove(animClass);
    }, 500);
  }
}

function changeBalance(amount) {
  let balance = document.querySelector(".balance");
  localStorage.setItem(
    "balance_ch",
    Number(localStorage.getItem("balance_ch")) + amount
  );
  balance.innerHTML = localStorage.getItem("balance_ch");
}

export { animateOnce, changeBalance };
