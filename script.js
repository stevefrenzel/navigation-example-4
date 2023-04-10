'use strict';

const skipLink = document.getElementById('skip-link');
const mainContent = document.getElementById('main');

// Primary navigation:
const logo = document.getElementById('logo');
const menuLinks = document.querySelectorAll('nav a');
const menuButton = document.getElementById('menu-button');

// Secondary navigation:
const closeButton = document.getElementById('close-button');
const hamburgerMenu = document.getElementById('menu');
const hamburgerMenuLinks = document.querySelectorAll('hamburger-menu-links a');

// Sub menu:
const buttons = document.querySelectorAll(
  '.sub-menu-button, .hamburger-sub-menu-button'
);
let currentlySelectedButton = null;

// * Trapping the focus inside the secondary navigation:

function makeInert(params) {
  if (params) {
    mainContent.setAttribute('inert', '');
    skipLink.style.display = 'none';

    // "inert" is currently not supported in Firefox, so we need the following hack
    mainContent.setAttribute('aria-hidden', 'true');
    const interactiveElements = main.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );
    interactiveElements.forEach((element) => {
      element.setAttribute('tabindex', '-1');
    });
  } else {
    mainContent.removeAttribute('inert', '');
    skipLink.style.display = 'initial';

    // "inert" is currently not supported in Firefox, so we need the following hack
    mainContent.setAttribute('aria-hidden', 'false');
    const interactiveElements = main.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );
    interactiveElements.forEach((element) => {
      element.removeAttribute('tabindex');
    });
  }
}

// * Add aria-current="page" to selected link, except for skip link

menuLinks.forEach((link) => {
  link.addEventListener('click', function (event) {
    if (event.target !== skipLink) {
      menuLinks.forEach((link) => link.removeAttribute('aria-current'));
      this.setAttribute('aria-current', 'page');
    }
    if (event.target.type !== 'button') {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'false';
      makeInert(isOpen);

      hamburgerMenu.style.display = 'none';
      menuButton.setAttribute('aria-expanded', false);
    }
  });
});

// * Open and close the hamburger menu by clicking the menu button:

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'false';
  makeInert(isOpen);

  menuButton.setAttribute('aria-expanded', isOpen);
  hamburgerMenu.style.display = `${isOpen ? 'flex' : 'none'}`;
});

// * Closing the hamburger menu when pressing the close button:

closeButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'false';
  makeInert(isOpen);

  hamburgerMenu.style.display = 'none';
  menuButton.setAttribute('aria-expanded', false);
});

// * Closing the menu when pressing "Escape":

document.addEventListener('keyup', (event) => {
  const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';

  if (event.code === 'Escape' && menuIsOpen) {
    makeInert(!menuIsOpen);
    hamburgerMenu.style.display = 'none';
    menuButton.setAttribute('aria-expanded', false);
  }
});

// * Closing the menu when clicking the logo

logo.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'false';
  makeInert(isOpen);

  hamburgerMenu.style.display = 'none';
  menuButton.setAttribute('aria-expanded', false);
});

// SUB MENU

// * Toggle the sub menu and update the corresponding aria-expanded property:

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    // Get the associated <ul> element
    const submenu = button.nextElementSibling;

    // Check if this submenu is already open
    const isOpen = submenu.classList.contains('open');

    // If a button is currently selected, close its associated submenu and update its aria-expanded attribute
    if (currentlySelectedButton) {
      const prevSubmenu = currentlySelectedButton.nextElementSibling;
      prevSubmenu.classList.remove('open');
      prevSubmenu.classList.add('closed');
      currentlySelectedButton.setAttribute('aria-expanded', 'false');
    }

    // Toggle the "open" and "closed" classes on the submenu and update its aria-expanded attribute
    if (isOpen) {
      submenu.classList.remove('open');
      submenu.classList.add('closed');
      button.setAttribute('aria-expanded', 'false');
      currentlySelectedButton = null;
    } else {
      submenu.classList.remove('closed');
      submenu.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      currentlySelectedButton = button;
    }
  });

  // Get all links inside the associated sub-menu element and attach a click event listener
  const submenuLinks =
    button.nextElementSibling.querySelectorAll('.sub-menu a');
  submenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Get the parent <ul> element and close it
      const submenu = link.closest('.sub-menu');
      submenu.classList.remove('open');
      submenu.classList.add('closed');
      currentlySelectedButton.setAttribute('aria-expanded', 'false');
      currentlySelectedButton = null;
    });
  });
});

// * Close the sub menu when pressing "Escape":

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (currentlySelectedButton) {
      const submenu = currentlySelectedButton.nextElementSibling;

      submenu.classList.remove('open');
      submenu.classList.add('closed');
      currentlySelectedButton.setAttribute('aria-expanded', 'false');
      currentlySelectedButton = null;
    }
  }
});

// ! Close all open submenus

// function closeAllSubmenus() {
//   const submenus = document.querySelectorAll(
//     '.sub-menu.open, .hamburger-sub-menu.open'
//   );
//   submenus.forEach((submenu) => {
//     submenu.classList.remove('open');
//     submenu.classList.add('closed');
//     const button = submenu.previousElementSibling;
//     button.setAttribute('aria-expanded', 'false');
//   });
//   currentlySelectedButton = null;
// }
