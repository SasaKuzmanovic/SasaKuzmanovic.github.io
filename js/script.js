let menuLinks = document.getElementById("menu-links");
var videos = document.getElementsByClassName("videji");

var doc = document.getElementsByClassName('pwa-install');

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


function showVideos() {

    for (var i = 0; i < videos.length; i++)
        {
            if (document.getElementsByClassName("videji")[i].style.display == "none")
                {
                    document.getElementsByClassName("videji")[i].style.display = "block";
                } else{
                    document.getElementsByClassName("videji")[i].style.display = "none";
                }
            
        }
    
}


const hiddenHeader = document.querySelectorAll('.header');

const hiddenCards = document.querySelectorAll('.cards');
const hiddenText = document.querySelectorAll('.title-text');


const hiddenTitle = document.querySelectorAll('.improvement-text');
const hiddenImageLocation = document.querySelectorAll('.image-location');

const hiddenBox = document.querySelectorAll('.box');
const hiddenPayables = document.querySelectorAll('.payables');

const hiddenPopup = document.querySelectorAll('.pwa-install');

hiddenHeader.forEach((el) => observer.observe(el));

hiddenCards.forEach((el) => observer.observe(el));
hiddenText.forEach((el) => observer.observe(el));

hiddenTitle.forEach((el) => observer.observe(el));
hiddenImageLocation.forEach((el) => observer.observe(el));

hiddenBox.forEach((el) => observer.observe(el));
hiddenPayables.forEach((el) => observer.observe(el));

hiddenPopup.forEach((el) => observer.observe(el));

function toggleMenu() {
    menuLinks.classList.toggle('show-menu');
}


// Installation

let installPrompt = null;
const installButton = document.querySelector("#install");
const installBox = document.querySelector("#noviid");
const closeButton = document.querySelector("#close");



window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installBox.removeAttribute("hidden");

});


installButton.addEventListener("click", async () => {
    if (!installPrompt) {
      return;
    }
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    installPrompt = null;
    installButton.setAttribute("hidden", "");

    installBox.setAttribute("hidden", "");
  });

closeButton.addEventListener("click", async () => {
    installBox.setAttribute("hidden", "");
  });
