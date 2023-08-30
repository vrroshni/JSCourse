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

const nav = document.querySelector(".nav");


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
  console.log(clicked, 'clickedclicked')
  if (!clicked) {
    return;
  }

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



// hover on navlinks
const navlinksHandleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this
      }

    })
    logo.style.opacity = this

  }
}

// passing "argument" to handler function
nav.addEventListener("mouseover", navlinksHandleHover.bind(0.5))
nav.addEventListener("mouseout", navlinksHandleHover.bind(1))


//not optimal way
// const cords = section1.getBoundingClientRect()


// window.addEventListener('scroll', function () {
//   if (window.scrollY > cords.top){
//    nav.classList.add('sticky') 
//   }else{
//     nav.classList.remove('sticky')

//   }
// })


const navHeight = nav.getBoundingClientRect().height


const makeItSicky = (entries) => {
  const [entry] = entries
  if (!entry.isIntersecting)
    nav.classList.add('sticky')
  else
    nav.classList.remove('sticky')
}

const header = document.querySelector(".header")
//show sticky when header part is gone
const stickyNav = new IntersectionObserver(makeItSicky, {
  root: null,
  threshold: 0,//percentege to show
  rootMargin: `${navHeight}px` //distance from the top of viewport, in px
})

stickyNav.observe(header)

const allSections = document.querySelectorAll('.section')
const secObserver = (entries, observer) => {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(secObserver, {
  root: null,
  threshold: .15
})

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})