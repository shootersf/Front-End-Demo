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
    addEventListenerToMultiples(galleryButtonClicked, "click",
                            document.getElementsByClassName("gallery-button"));
})();

//adds testimonialButtonClicked function to all testimonial buttons
(function() {
    addEventListenerToMultiples(testimonalButtonClicked, "click",
                            document.getElementsByClassName("testimonial-button")); 
})();

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
    let images = document.getElementsByClassName("img-container");
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
    let staticImages = Array.from(images).filter(img => img.style.position === "relative");
    transitionRemainingImagesToNewPos(staticImages);

}

function testimonalButtonClicked() {
    //Highlight the clicked button
    const testimonialButtons = document.getElementsByClassName("testimonial-button");
    makeOneOfGroupActive(testimonialButtons, this);
    //adjust testimonial containers position to change focus
    //calculate transformation
    const testWidth = getTestimonialWidth();
    const trans = testWidth * Number(this.dataset.index) * -1;
    //get container and apply transition
    const testContainer = document.getElementById("testimonials-container");
    testContainer.classList.add("testimonials-container-transition");
    testContainer.style.transform = `translateX(${trans}px)`;
    // // at end of transition remove the class so drag and drop is not effected.
    // testContainer.addEventListener("transitionend", function() {
    //     testContainer.classList.remove("testimonials-container-transition");
    //     testContainer.removeEventListener("transitionend");
    //});
}

//add mouse handlers to testimonial container and closure on variables and functions
(function() {
    const tContainer = document.getElementById("testimonials-container");
    tContainer.addEventListener("mousedown", testimonialMouseStart);
    tContainer.addEventListener("mouseleave", testimonialMouseEnd);
    tContainer.addEventListener("mouseup", testimonialMouseEnd);
    tContainer.addEventListener("mousemove", testimonialMouseMove);

    let isDown = false;
    let startMouseX;
    let initialTranslate;
    let finalTranslate;

    function testimonialMouseStart(event) {
        isDown = true;
        //turn off transitions
        tContainer.classList.remove("testimonials-container-transition");
        tContainer.classList.add("testimonial-grabbed");
        //get initial Translate
        initialTranslate = getTranslateX(tContainer);
        finalTranslate = initialTranslate;  //set final if mouse doesn't move
        //set startMouseX
        startMouseX = event.pageX;
    }

    function testimonialMouseEnd() {
        //escape if mouse leave calls but mouse is not down
        if(!isDown)
            return;
        
        isDown = false;
        tContainer.classList.remove("testimonial-grabbed");
        scrollToCorrectTestimonial();
    }

    function testimonialMouseMove(event) {
        if (!isDown)
            return;
        
        event.preventDefault;
        moveTestimonyWithinBounds(startMouseX, event.pageX);
    }

    function moveTestimonyWithinBounds(start, finish)
    {
        const diff = (finish - start) * 2;
        finalTranslate = initialTranslate + diff;
        const MIN = getTestimonialWidth() * -2;
        const MAX = 0;
        if (finalTranslate >= MIN && finalTranslate <= MAX)
        {
            tContainer.style.transform = `translateX(${finalTranslate}px)`;
        }
    
    }

    function scrollToCorrectTestimonial() {
        const THRESHOLD = 30;
        const finalDiff = finalTranslate - initialTranslate;
        const tWidth = getTestimonialWidth();
        tContainer.classList.add("testimonials-container-transition");


        //if didn't move enough reset
        if(Math.abs(finalDiff) < THRESHOLD)
        {
            tContainer.style.transform = `translateX(${initialTranslate}px)`;
        }
        //if it moved less than one testimonial go to that
        else if (Math.abs(finalDiff) < tWidth)
        {
            let newTrans;
            if (finalDiff > 0)
            {
                newTrans = initialTranslate + tWidth;
            }
            else
            {
                newTrans = initialTranslate - tWidth;
            }
            tContainer.style.transform = `translateX(${newTrans}px)`;
            updateTestButtonByTrans(newTrans)
        }
        //if more than one move two
        else
        {
            let newTrans;
            if (finalDiff > 0)
            {
                newTrans = initialTranslate + 2 * tWidth;
            }
            else
            {
                newTrans = initialTranslate - 2 * tWidth;
            }
            tContainer.style.transform = `translateX(${newTrans}px)`;
            updateTestButtonByTrans(newTrans);
        }

    }

    function updateTestButtonByTrans(trans) {
        const id = - trans / getTestimonialWidth();
        console.log(id);
        const btns = document.getElementsByClassName("testimonial-button");
        makeOneOfGroupActive(btns, btns[id]);
    }
})();

//HELPER FUNCTIONS

function addEventListenerToMultiples(func, event, group)
{
    for (let element of group)
    {
        element.addEventListener(event, func);
    }
}

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
    let images = document.getElementsByClassName("img-container");
    for (let image of images)
    {
        showGalleryImage(image);
    }
}

function showGalleryImagesGroup(group) {
    let images = document.getElementsByClassName("img-container");
    let hiddenImages = [];
    for (let image of images)
    {
        if (image.dataset.group === group)
            showGalleryImage(image);
        else
            hiddenImages.push(image);
    }
    hideGalleryImages(hiddenImages);
}

function showGalleryImage(image) {
    //set wasHidden flag for transitionRemainingImagesToNewPost to reset scale before turning off transitions
    if (image.style.position === "absolute")
        image.dataset.wasHidden = true;
    else
        image.dataset.wasHidden = false;
    
    image.style.position = "relative";
    image.style.transform = "none";
    image.style.top = 0;
    image.style.left = 0;
}

function hideGalleryImages(images) {
    for(let image of images)
    {
        image.style.top = `${image.dataset.oldposy}px`;
        image.style.left = `${image.dataset.oldposx}px`;
        image.style.position = "absolute";
        image.style.transform = "scale(0)";
    }
    
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

function getTestimonialWidth()
{
    let test = document.querySelector(".testimonial");
    return test.offsetWidth;
}

function getTranslateX(element) {
    if (!element.style.transform)
        return 0;
    
    const transStyle = element.style.transform;
    const translateX = Number(transStyle.replace(/[^\d.-]/g, ""));
    return translateX;
}