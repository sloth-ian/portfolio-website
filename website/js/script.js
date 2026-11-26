const nav = document.getElementById("nav");     // get nav / finds the id = nav in html
const sections = Array.from(document.querySelectorAll("main section"));     // saves all sections in main + has the .some function
let current = 0;
let highlighted = 0;

// svg stuff

const svgWord  = "http://www.w3.org/2000/svg";  // weird svg tag thing that js needs
const outer = 200, inner = 25, hub = 50, labelDist = 110;     // outer radius, inner radius, inner circle, distance of text 
const step = (2 * Math.PI) / sections.length;   // the slice angle (divided by the number of sections I have)

// helper functions

function make(tag, attrs, parent) {        // make SVG element and return it
    const element = document.createElementNS(svgWord, tag);
    for (const name in attrs) element.setAttribute(name, attrs[name]);
    parent.appendChild(element);    
    return element;
}
function point(radius, angle) {            // cartesian coordinates (x,y)
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}
function slicePath(startAngle, endAngle) {               // the outline of one slice (for the wheel wedges)
    const startOuter = point(outer, startAngle), endOuter = point(outer, endAngle);
    const startInner = point(inner, startAngle), endInner = point(inner, endAngle);
    const MAX = endAngle - startAngle > Math.PI ? 1 : 0;
    return "M" + startOuter.join(" ") +
    " A" + outer + " " + outer + " 0 " + MAX + " 1 " + endOuter.join(" ") +
    " L" + endInner.join(" ") +
    " A" + inner + " " + inner + " 0 " + MAX + " 0 " + startInner.join(" ") + " Z";
}

nav.innerHTML = "";   // removes all links inside (no duplicates)
nav.classList.add("wheel");

const svg = make("svg", { viewBox: "-250 -250 500 500" }, nav);

const slices = sections.map(function (section, i) {
    const start = (i - 0.5) * step - Math.PI / 2;   // first slice is centered at the top
    const end = start + step;
    const mid = (start + end) / 2;
    const path = slicePath(start, end);
    const label = section.dataset.title || section.querySelector("h2").textContent;
    // finds the heading title and makes it the name of the link
    // also tries a dataset title first if it exists

    //slice maker
    const slice = make("a", { "class": "slice", href: "#" + section.id }, svg);
    slice.style.setProperty("--h", (250 + (i / sections.length) * 360) % 360);   
        // each slice gets its own color - FIGURE OUT BETTER COLOR SETUP LATER

    make("path", { "class": "hit", d: path }, slice);          // hitbox invisible
    const shape = make("g", { "class": "shape" }, slice);   // slice go bigger
    make("path", { d: path }, shape);
    const pos = point(labelDist, mid);
    make("text", { "class": "label", x: pos[0], y: pos[1] }, shape).textContent = label;

    slice.addEventListener("mouseenter", function () { setHighlight(i); });
    slice.addEventListener("focus", function () { setHighlight(i); });

    slice.addEventListener("mouseleave", function () { slice.classList.remove("highlight"); });
    slice.addEventListener("blur", function() { slice.classList.remove("highlight"); });

    return slice;
});

make("circle", { "class": "hub", r: hub }, svg);

function showMenu() {                              // menu mode only wheel
    current = -1;                                  // nothing is selected
    document.body.classList.remove("viewing");
    sections.forEach(function (section) { section.classList.add("hidden"); });
    slices.forEach(function (slice) { slice.classList.remove("active", "highlight"); });
}

function showSection(i) {  // old highlight function + it hides all the sections + slice
    current = i;
    setHighlight(i);
    document.body.classList.add("viewing");
    sections.forEach(function (section, j) {
        section.classList.toggle("hidden", j !== i);
    });
    slices.forEach(function (slice, j) {    
        slice.classList.toggle("active", j === i);
        slice.classList.remove("highlight");
    });
    window.scrollTo(0, 0);
}

function setHighlight(i) {
    highlighted = (i + sections.length) % sections.length;   // wraps around at the ends
    slices.forEach(function (slice, j) {
        slice.classList.toggle("highlight", j === highlighted);
    });
}

function moveHighlight(direction) {
    let i = highlighted;
    do {
        i = (i + direction + sections.length) % sections.length;
    } while (i === current && sections.length > 1);
    setHighlight(i);
}

function route() {  // reads url to check section hider
    const id = location.hash.slice(1);    // gets the id name
    let i = sections.findIndex(function (section) { return section.id === id; });   // we find index now
    if (i < 0) {
        showMenu();
    } else {
        showSection(i);
    }
}

window.addEventListener("hashchange", route);   // listens if the link changes (kinda like JButton)
route();    // already runs highlight(route now) just in case the link is already changed                   

window.addEventListener("keydown", function (e) {   // arrow key buttons now! + enter
    const viewing = document.body.classList.contains("viewing");    // checks if we are on the menu page or not
    if (e.key === "Escape" && viewing) {    // escape exit
        location.hash = "";
    } else if (!viewing) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();                        
            moveHighlight(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();                          
            moveHighlight(-1);
        } else if (e.key === "Enter") {
            e.preventDefault();                          
            location.hash = sections[highlighted].id;    // select the highlighted slice
        }
    }
});