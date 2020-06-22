const initMobileNav = function() {
  /**
   * Toggling menu displaying
   */
  const navButton = document.querySelector(".menu__button");
  if (!!navButton) {
    navButton.addEventListener("click", function(e) {
      e.preventDefault();
      const btn = e.currentTarget,
        nav = btn.closest(".menu"),
        body = document.body;

      if (!!nav) {
        if (nav.classList.contains("menu_opened")) {
          // nav.classList.remove("menu_opened");
          body.classList.remove("no-scroll");
          nav.classList.remove("menu_opened");
        } else {
          // nav.classList.add("menu_opened");
          body.classList.add("no-scroll");
          nav.classList.add("menu_opened");
        }
      }
    });
  }

  /**
   * First level menu items
   */
  const menuItems = document.querySelectorAll(
    ".menu__item_has-submenu a, .menu__item_has-submenu span"
  );
  for (let i = 0; i < menuItems.length; i++) {
    const menuItem = menuItems[i];
    menuItem.addEventListener("click", function(e) {
      e.preventDefault();
      const el = e.currentTarget;
      const parent = el.closest(".menu__item_has-submenu");
      parent.classList.toggle("menu__item_opened");
    });
  }

  /**
   * Second level menu items
   */
  const submenuItems = document.querySelectorAll(
    ".submenu__lvl1-item .submenu__button"
  );
  for (let i = 0; i < submenuItems.length; i++) {
    const submenuItem = submenuItems[i];
    submenuItem.addEventListener("click", function(e) {
      e.preventDefault();
      const el = e.currentTarget;
      const parent = el.closest(".submenu__lvl1-item");
      parent.classList.toggle("submenu__lvl1-item_opened");
    });
  }

  /**
   * Moving third level menus up to the second level items
   */
  const secondMenuItems = document.querySelectorAll(
    ".menu .submenu__lvl1-item .submenu__button"
  );
  const thirdMenus = document.querySelectorAll(".menu .submenu__lvl2");

  for (let i = 0; i < secondMenuItems.length; i++) {
    const thirdMenu = thirdMenus[i] || null;
    const secondMenuItem = secondMenuItems[i].closest(".submenu__lvl1-item");
    console.log(secondMenuItems, thirdMenu);

    if (!!thirdMenu) {
      thirdMenu.classList.remove("submenu__lvl2_active");
      secondMenuItem.append(thirdMenu);
    }
  }

  /**
   * Contacts section
   */
  const contacts = document.querySelector(".menu__inner .submenu_contacts");
  if (!!contacts) {
    const menuInner = contacts.closest(".menu__inner");
    if (!!menuInner) menuInner.append(contacts);
  }
};

/* =============== */

// const initSubSubMenu = function() {
//   let subMenus = document.querySelectorAll(".submenu_with-subsubmenu");
//   if (!subMenus) return false;

//   for (let i = 0; i < subMenus.length; i++) {
//     const subMenu = subMenus[i];
//     const subMenuItems = subMenu.querySelectorAll(
//       ".submenu__lvl1-item .submenu__button"
//     );
//     // const sub2 = subMenu.querySelectorAll(".submenu__lvl2");
//     for (let num = 0; num < subMenuItems.length; num++) {
//       const subMenuItem = subMenuItems[num];
//       subMenuItem.addEventListener("click", function(e) {
//         e.preventDefault();
//         showSubSubMenu(num, e.currentTarget);
//       });
//     }
//   }
// };

// /**
//  *
//  * @param {int} aNum
//  * @param {DOM} aButtton
//  */
// const showSubSubMenu = function(aNum, aButton) {
//   const container = aButton.closest(".submenu__container");

//   if (!!container) {
//     const lvl1Items = container.querySelectorAll(".submenu__lvl1-item");
//     const lvl2Items = container.querySelectorAll(".submenu__lvl2");

//     // Removing all active classes for lvl1 items
//     for (let i = 0; i < lvl1Items.length; i++) {
//       const item = lvl1Items[i];
//       item.classList.remove("submenu__lvl1-item_active");
//     }

//     // Removing all active classes for lvl2 items
//     for (let i = 0; i < lvl2Items.length; i++) {
//       const item = lvl2Items[i];
//       item.classList.remove("submenu__lvl2_active");
//     }

//     // Adding Active class to both lvl items
//     lvl1Items[aNum].classList.add("submenu__lvl1-item_active");
//     lvl2Items[aNum].classList.add("submenu__lvl2_active");
//   }
// };

// export { initSubSubMenu };

export { initMobileNav };
