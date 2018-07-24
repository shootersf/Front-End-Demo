/*FUNCTIONS RAN ON START*/

//Adds smooth scrolling to anchor links
(function() {
    let anchorlinks = document.querySelectorAll('a[href^="#"]')
    for (let item of anchorlinks) {
        item.addEventListener('click', (e)=> {
            let hashval = item.getAttribute('href')
            let target = document.querySelector(hashval)
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
            history.pushState(null, null, hashval)
            e.preventDefault()
        })
    }
})();

//adds galleryButtonClicked function to all gallery buttons
(function() {
    let galleryButtons = document.getElementsByClassName("gallery-button");
    for (let i = 0; i < galleryButtons.length; i++)
    {
        galleryButtons[i].addEventListener("click", galleryButtonClicked);
    }
})();

//adds top and left to each gallery image that matches it's current position. Declared and called
//seperately as may need to recall on window resize
function setImageAbsCoords() {
    let images = document.getElementsByClassName("gallery-image");
    for (let image of images)
    {
        let y = image.offsetTop + "px";
        let x = image.offsetLeft + "px";

        image.style.top = y;
        image.style.left = x;
    }
}
setImageAbsCoords();
/*EVENT HANDLERS*/

//Watches for a point during scrolling to toggle the navbar look and updates active link at all times
window.onscroll = function() {
    const SHOULD_BE_DARK = 160;

    if(window.scrollY >= SHOULD_BE_DARK && !darkNavCheck())
        toggleNav();
    else if(window.scrollY < SHOULD_BE_DARK && darkNavCheck())
        toggleNav();
    
    adjustActiveLinkNav(window.scrollY);
}

//Learn more button. Scrolls to about.
document.getElementById("learn-more").onclick = function() {
    let aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

function galleryButtonClicked() {
    //Highlight the clicked button
    let galleryButtons = document.getElementsByClassName("gallery-button");
    makeOneOfGroupActive(galleryButtons, this);

    if (this.dataset.group == 0)
        showAllGalleryImages();
    else
        showGalleryImagesGroup(this.dataset.group);
}

//HELPER FUNCTIONS

function darkNavCheck() {
    let nav = document.getElementById("nav");
    return nav.classList.contains("nav-dark") ? true : false;
        
}

function toggleNav() {
    document.getElementById("nav").classList.toggle("nav-dark");
}

function adjustActiveLinkNav(winScroll) {
    let aboveScroll;

    const sections = document.getElementsByTagName("section");
    const links = document.getElementsByClassName("nav-link");
    //find last section above the scroll
    for (let i = 0; i < sections.length; i++)
    {
        if (sections[i].offsetTop <= winScroll)
            aboveScroll = sections[i];  //will keep being replaced until the last element above
    }
    //if nothing is above set all to inactive and return
    if (!aboveScroll)
        {
            makeOneOfGroupActive(links, null)
            return;
        }
    
    //step through and adjust active link
    for (let i = 0; i < links.length; i++)
    {
        //tests section above scroll's id against links a-href
        if ("#" + aboveScroll.id === links[i].getAttribute("href"))
            {
                makeOneOfGroupActive(links, links[i]);
                return;
            }
    }
}
//makes one element active and removes from the rest. If toActive is set to null, all items will
//be made inactive.
function makeOneOfGroupActive(group, toActive) {
    for (let i = 0; i < group.length; i++)
    {
        if(group[i] === toActive)
            group[i].classList.add("active");
        else
            group[i].classList.remove("active");
    }
}

function showAllGalleryImages() {
    let images = document.getElementsByClassName("gallery-image");
    for (let image of images)
    {
        showGalleryImage(image);
    }
}

function showGalleryImagesGroup(group) {
    let images = document.getElementsByClassName("gallery-image");
    for (let image of images)
    {
        if (image.dataset.group === group)
            showGalleryImage(image);
        else
            hideGalleryImage(image);
    }
}

function showGalleryImage(image) {
    image.style.position = "static";
    image.style.transform = "scale(1)";
}

function hideGalleryImage(image) {
    image.style.position = "absolute";
    //image.style.zindex = "2";
    image.style.transform = "scale(0)";
    image.style.transition = "transform 400ms ease-in-out";

}

