function animateOnce(selector, animClass = 'anim') {
    for (let node of document.querySelectorAll(selector)) {
        node.classList.add(animClass)
        setTimeout(() => {
            node.classList.remove(animClass)
        }, 500);
    }
}

function animate(selector) {
    for (let node of document.querySelectorAll(selector)) {
        setInterval(() => {
            node.classList.add('anim')
            setTimeout(() => {
                node.classList.remove('anim')
            }, 500);
        }, 2500);
    }
}

function changeBalance(amount) {
    let balance = document.querySelector('.balance')
    localStorage.setItem('balance_ch', Number(localStorage.getItem('balance_ch')) + amount)
    balance.innerHTML = localStorage.getItem('balance_ch')
}

export { animate, animateOnce, changeBalance }