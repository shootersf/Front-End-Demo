/*FUNCTIONS RAN ON START*/

//Adds smooth scrolling to anchor links
let addSmoothAtStart = function() {
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
}();

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

document.getElementById("learn-more").onclick = function() {
    let aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
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
        console.log(sections[i].offsetTop, winScroll);
        if (sections[i].offsetTop <= winScroll)
            aboveScroll = sections[i];  //will keep being replaced until the last element above
    }
    console.log(aboveScroll);
    //step through and adjust active link
    for (let i = 0; i < links.length; i++)
    {
        if (aboveScroll === sections[i])
            links[i].classList.add("active");
        else
            links[i].classList.remove("active");
    }
}

