const initSubSubMenu = function() {
  let subMenus = document.querySelectorAll(".submenu_with-subsubmenu");
  if (!subMenus) return false;

  for (let i = 0; i < subMenus.length; i++) {
    const subMenu = subMenus[i];
    const subMenuItems = subMenu.querySelectorAll(
      ".submenu__lvl1-item .submenu__button"
    );
    // const sub2 = subMenu.querySelectorAll(".submenu__lvl2");
    for (let num = 0; num < subMenuItems.length; num++) {
      const subMenuItem = subMenuItems[num];
      subMenuItem.addEventListener("click", function(e) {
        e.preventDefault();
        showSubSubMenu(num, e.currentTarget);
      });
    }
  }
};

/**
 *
 * @param {int} aNum
 * @param {DOM} aButtton
 */
const showSubSubMenu = function(aNum, aButton) {
  const container = aButton.closest(".submenu__container");

  if (!!container) {
    const lvl1Items = container.querySelectorAll(
      ".submenu__lvl1-item .submenu__button"
    );
    const lvl2Items = container.querySelectorAll(".submenu__lvl2");

    // Removing all active classes for lvl1 items
    for (let i = 0; i < lvl1Items.length; i++) {
      const item = lvl1Items[i].closest(".submenu__lvl1-item");
      item.classList.remove("submenu__lvl1-item_active");
    }

    // Removing all active classes for lvl2 items
    for (let i = 0; i < lvl2Items.length; i++) {
      const item = lvl2Items[i];
      item.classList.remove("submenu__lvl2_active");
    }

    // Adding Active class to both lvl items
    const activeItem = lvl1Items[aNum].closest(".submenu__lvl1-item");
    activeItem.classList.add("submenu__lvl1-item_active");
    lvl2Items[aNum].classList.add("submenu__lvl2_active");
  }
};

export { initSubSubMenu };
