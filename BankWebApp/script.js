'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');



const btnLearnMore = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')


const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//scrolling

btnLearnMore.addEventListener("click", function (e) {
  //way1
  //coordinates of section element
  // const cords = section1.getBoundingClientRect()
  //coordinates of section scroll bar
  // window.scrollTo({
  //   left: cords.left + window.pageXOffset,
  //   top: cords.left + window.pageYOffset,
  //   behavior: 'smooth'
  // })


  // new way
  section1.scrollIntoView({
    behavior:'smooth'
  })



})

