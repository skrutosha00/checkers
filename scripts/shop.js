import { animateOnce, changeBalance } from "./functions.js"

if (!localStorage.getItem('1_ch')) {
    localStorage.setItem('1_ch', 1)
}

if (!localStorage.getItem('chosen_ch')) {
    localStorage.setItem('chosen_ch', 1)
}

let items = [
    { name: "1", price: 0 },
    { name: "2", price: 750 },
    { name: "3", price: 1250 }
]

let balance = document.querySelector('.balance')
let cardCont = document.querySelector('.shop')

balance.innerHTML = localStorage.getItem('balance_ch')

for (let item of items) {

    if (!localStorage.getItem(item.name + '_ch')) {
        localStorage.setItem(item.name + '_ch', 0)
    }

    let card = document.createElement('div')
    card.classList.add('card')

    let picCont = document.createElement('div')
    picCont.classList.add('pic_cont', 'block')
    card.appendChild(picCont)

    let pic = document.createElement('img')
    pic.src = '../png/board_' + item.name + '.png'
    picCont.appendChild(pic)

    let button = document.createElement('div')
    button.classList.add('button', 'block', 'button_yellow')
    button.innerHTML = item.price
    button.dataset.item = item.name

    if (localStorage.getItem(item.name + '_ch') == 1) {
        button.classList.replace('button_yellow', 'button_green')
        button.innerHTML = 'Select'
    }

    if (localStorage.getItem('chosen_ch') == item.name) {
        button.classList.replace('button_yellow', 'button_green')
        button.innerHTML = 'Selected'
    }

    card.appendChild(button)

    button.onclick = () => {
        let price = item.price

        if (localStorage.getItem(button.dataset.item + '_ch') == 1) {
            localStorage.setItem('chosen_ch', button.dataset.item)

            for (let b of document.querySelectorAll('.button')) {
                if (b.innerHTML == 'Selected') {
                    b.innerHTML = 'Select'
                }
            }

            button.innerHTML = 'Selected'
        }

        if (button.innerHTML == price) {
            if (Number(balance.innerHTML) < price) {
                animateOnce('.balance')
                return
            }

            button.innerHTML = 'Selected'
            button.classList.replace('button_yellow', 'button_green')

            for (let b of document.querySelectorAll('.button')) {
                if (b.innerHTML == 'Selected') {
                    b.innerHTML = 'Select'
                }
            }
            
            changeBalance(-price)

            localStorage.setItem(button.dataset.item + '_ch', 1)
            localStorage.setItem('chosen_ch', button.dataset.item)
        }
    }

    cardCont.appendChild(card)
}

window.onload = () => {
    document.querySelector('.wrapper').classList.remove('hidden')
}