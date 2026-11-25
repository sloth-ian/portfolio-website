const nav = document.getElementById("nav");     // get nav / finds the id = nav in html
const sections = Array.from(document.querySelectorAll("main section"));     // saves all sections in main + has the .some function

nav.innerHTML = "";   // removes all links inside (no duplicates)

sections.forEach(function (section) {
  const link = document.createElement("a"); // new <a> tag
  link.href = "#" + section.id;                           // makes a link with # and the name of the section
  link.textContent = section.dataset.title || section.querySelector("h2").textContent;   
    // finds the heading title and makes it the name of the link
    // also tries a dataset title first if it exists
  nav.appendChild(link);    // puts the link and stuff into nav
});

function showSection(id) {  // old highlight function + it hides all the sections
  sections.forEach(function (section) {
    section.classList.toggle("hidden", section.id !== id);  // adds hidden modifier to everything but the section clicked
  });
  nav.querySelectorAll("a").forEach(function (link) {   // gets all of the links
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);    
        // checks if the link is the same as page url link - uses the href name instead of location hash
  });
}

function route() {  // reads url to check section hider
  const id = location.hash.slice(1);    // gets the id name
  const exists = sections.some(function (section) { return section.id === id; });   // uses some to check if the id is equal
  showSection(exists ? id : sections[0].id);    // if the section does exist then you go there if not just do main section
}

window.addEventListener("hashchange", route);   // listens if the link changes (kinda like JButton)
route();    // already runs highlight(route now) just in case the link is already changed                                        
