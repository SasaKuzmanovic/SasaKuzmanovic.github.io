let menuLinks = document.getElementById("menu-links");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.toggle('vidim', entry.isIntersecting);
        }

        if (!entry.isIntersecting) {
            entry.target.classList.remove('vidim');
        }
    });
});

const hiddenHeader = document.querySelectorAll('.header');

const hiddenCards = document.querySelectorAll('.cards');
const hiddenText = document.querySelectorAll('.title-text');


const hiddenTitle = document.querySelectorAll('.improvement-text');
const hiddenImageLocation = document.querySelectorAll('.image-location');

const hiddenBox = document.querySelectorAll('.box');
const hiddenPayables = document.querySelectorAll('.payables');

hiddenHeader.forEach((el) => observer.observe(el));

hiddenCards.forEach((el) => observer.observe(el));
hiddenText.forEach((el) => observer.observe(el));

hiddenTitle.forEach((el) => observer.observe(el));
hiddenImageLocation.forEach((el) => observer.observe(el));

hiddenBox.forEach((el) => observer.observe(el));
hiddenPayables.forEach((el) => observer.observe(el));

function toggleMenu() {
    menuLinks.classList.toggle('show-menu');
}