'use strict';

const showModalBtns = document.querySelectorAll('.show-modal')
const modal = document.querySelector('.modal')
const closeModal = document.querySelector('.close-modal')
const overlay = document.querySelector('.overlay')
const openModal = () => {

    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')

}

const closeModalFunction = () => {

    modal.classList.add('hidden')
    overlay.classList.add('hidden')

}

for (let i = 0; i < showModalBtns.length; i++) {
    showModalBtns[i].addEventListener("click", openModal)
}

closeModal.addEventListener("click", closeModalFunction)
overlay.addEventListener("click", closeModalFunction)
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape" && !modal.classList.contains('hidden')) {
          closeModalFunction()
    }

})