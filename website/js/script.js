const nav = document.getElementById("nav");     // get nav / finds the id = nav in html
const sections = document.querySelectorAll("main section");     // saves all sections in main

nav.innerHTML = "";   // removes all links inside (no duplicates)

sections.forEach(function (section) {
  const link = document.createElement("a"); // new <a> tag
  link.href = "#" + section.id;                           // makes a link with # and the name of the section
  link.textContent = section.querySelector("h2").textContent;   // finds the heading title and makes it the name of the link
  nav.appendChild(link);    // puts the link and stuff into nav
});

function highlight() {  // little button function when you click a link in nav
  const links = nav.querySelectorAll("a");  // gets all of the links
  links.forEach(function (link) {   // for each link in the link
    link.classList.toggle("active", link.getAttribute("href") === location.hash);   
        // checks if the link is the same as page url link (location hash) if yes add active to link
  });
}

window.addEventListener("hashchange", highlight);   // listens if the link changes (kinda like JButton)
highlight();    // already runs highlight just in case the link is already changed                                        
