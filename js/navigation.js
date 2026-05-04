const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton && menuCloseButton) {
  menuOpenButton.addEventListener("click", () => {
    document.body.classList.add("show-mobile-menu");
  });

  menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu");
    });
  });
}