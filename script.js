let slideIndex = 0;
let menuLinks = document.getElementById("menu-links");
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