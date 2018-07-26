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
//TODO: recall on resize
function setImageAbsCoords() {
    let images = document.getElementsByClassName("gallery-image");
    for (let image of images)
    {
        //for later do not update if already set to absolute position
        if (image.style.position !== "absolute")
        {
            let y = image.offsetTop + "px";
            let x = image.offsetLeft + "px";

            image.style.top = y;
            image.style.left = x;
        }
    }
}
setImageAbsCoords();


/*EVENT HANDLERS*/

window.onscroll = function() {
    const SHOULD_BE_DARK = 160;
    //adjust nav look based on scroll 
    if(window.scrollY >= SHOULD_BE_DARK && !darkNavCheck())
        toggleNav();
    else if(window.scrollY < SHOULD_BE_DARK && darkNavCheck())
        toggleNav();
    
    //highlight active link on scroll bar
    adjustActiveLinkNav(window.scrollY);

    //check if stat counter is visible for the first time and run counters
    let stats = document.getElementById("stats-container");
    if(stats.dataset.seen === "false")
    {
        if (checkIfVisible(stats, window.scrollY, document.documentElement.clientHeight))
        {
            runStatsCounters();
            stats.dataset.seen = "true";
        }
    }
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

    //gather images old positions
    let images = document.getElementsByClassName("gallery-image");
    console.log(images.length);
    for (let image of images) 
    {
        image.dataset.oldposx = image.offsetLeft;
        image.dataset.oldposy = image.offsetTop;
    }

    //show only group images
    if (this.dataset.group == 0)
        showAllGalleryImages();
    else
        showGalleryImagesGroup(this.dataset.group);

    //Fake transitioning remaining images to their new position
    let staticImages = Array.from(images).filter(img => img.style.position === "static");
    transitionRemainingImagesToNewPos(staticImages);

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
    let aboveScroll;    //will point to the last section above winScroll

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
    //set wasHidden flag for transitionRemainingImagesToNewPost to reset scale before turning off transitions
    if (image.style.position === "absolute")
        image.dataset.wasHidden = true;
    else
        image.dataset.wasHidden = false;
    
    image.style.position = "static";
    image.style.transform = "none";
}

function hideGalleryImage(image) {
    image.style.position = "absolute";
    image.style.transform = "scale(0)";
}

function transitionRemainingImagesToNewPos(images) {
    for (let image of images)
    {
        //turn off transitions
        image.classList.add("no-transition");
        //move back to old position before gallery reshaped.
        diffx = image.dataset.oldposx - image.offsetLeft;
        diffy = image.dataset.oldposy - image.offsetTop;
        image.style.transform = `translate(${diffx}px, ${diffy}px)`;
        //set scale back to 0 if had been hidden before now
        if (image.dataset.wasHidden === 'true')
            image.style.transform += ` scale(0)`;
        
        image.offsetHeight; //force a redraw
        //turn on transition and move to new position/scale
        image.classList.remove("no-transition");
        image.style.transform = "none";
    }
    //update top and left to new position
    setImageAbsCoords();
}

//checks if all of an element is on screen.
function checkIfVisible(element, viewTop, winHeight) {
        const bottomScroll = viewTop + winHeight;
        const elementBottom = element.offsetTop + element.offsetHeight;
        return bottomScroll >= elementBottom ? true : false;
}

//creates a counting effect starting at one to a final number
function runStatsCounters() {
    const TOTAL_ANIM_TIME = 1500;
    let counters = document.getElementsByClassName("counter")
    for (let counter of counters)
    {
        //final number displayed in the counter
        const final = Number(counter.dataset.final);
        const textElement = counter.querySelector(".counter-text");
        //create staggered timeouts to go from 1 to Final in TOTAL_ANIM_TIME
        for (let i = 2; i <= final; i++)
        {
            const animTime = TOTAL_ANIM_TIME * ((i - 1)/(final - 1));
            //pass i as num so incrementing i in for loop doesn't mess up code.
            setTimeout(num => {
                textElement.textContent = num;
            }, animTime, i);
        }

    }
}