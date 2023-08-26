"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnLearnMore = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const navLinks = document.querySelector(".nav__links");

const operations = document.querySelector(".operations");
const operationTabContainer = document.querySelector(
  ".operations__tab-container"
);
const operationTab = document.querySelectorAll(".operations__tab");
const operationContent = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//scrolling
btnLearnMore.addEventListener("click", function (e) {
  //way1(deprecated)
  //coordinates of section element
  // const cords = section1.getBoundingClientRect()
  //coordinates of section scroll bar
  // window.scrollTo({
  //   left: cords.left + window.pageXOffset,(deprecated)
  //   top: cords.left + window.pageYOffset,(deprecated)
  //   behavior: 'smooth'
  // })

  // new way
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    console.log(e.target);
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

operationTabContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  console.log(clicked,'clickedclicked')
  if (!clicked) return;

  operationTab.forEach((el) => {
    el.classList.remove("operations__tab--active");
  });
  
  operationContent.forEach((el) => {
    el.classList.remove("operations__content--active");
  });

  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});
