let slideIndex = 0;
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

const hiddenCards = document.querySelectorAll('.cards');
const hiddenText = document.querySelectorAll('.title-text');
hiddenCards.forEach((el) => observer.observe(el));
hiddenText.forEach((el) => observer.observe(el));



showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }
    slideIndex++;

    if (slideIndex > slides.length) {
        slideIndex = 1
    }

    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 6000);
} 


function toggleMenu() {
    menuLinks.classList.toggle('show-menu');
}