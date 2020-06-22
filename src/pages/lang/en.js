import "modern-css-reset";

import Flickity from "flickity";
import "flickity/dist/flickity.css";

import mobile from "is-mobile";

import { initSubSubMenu } from "../../components/nav/nav_desktop.js";
import { initMobileNav } from "../../components/nav/nav_mobile.js";

import {
  preparePopup,
  closePopups,
  initPopupHadlers,
  showMessagePopup
} from "../../components/popup/popup.js";

const isMobile = mobile(); // ? is Mobile

if (isMobile) {
  require("./styles-mobile.scss");
} else {
  require("./styles-desktop.scss");
}

(function() {
  let galleries = [],
    windowSize,
    messagePopup;

  /**
   * Home page scripts initialization
   * */
  function init() {
    if (isMobile) {
      // if Mobile
      initMobile();
    } else {
      // if Desktop
      initDesktop();
    }

    window.ytppaBase = { galleries: galleries };
  }

  /**
   * Initializing homepage for mobile
   */
  function initMobile() {
    initPopupHandlers();

    initMobileNav();

    galleries.push(
      prepareGallery(".content--4-cells", {
        // options
        cellAlign: "center",
        percentPosition: false,
        draggable: ">1",
        pageDots: true,
        prevNextButtons: false,
        setGallerySize: true,
        // autoPlay: 1500,
        // autoPlay: true,
        // contain: true
        wrapAround: true
      })
    );

    galleries.push(
      prepareGallery(".reviews", {
        // options
        cellAlign: "center",
        percentPosition: false,
        draggable: ">1",
        pageDots: true,
        prevNextButtons: false,
        setGallerySize: true,
        // autoPlay: 1500,
        // autoPlay: true,
        // contain: true
        wrapAround: true
      })
    );

    galleries.push(
      prepareGallery(".hor-slider", {
        // options
        cellAlign: "center",
        percentPosition: false,
        draggable: ">1",
        pageDots: false,
        prevNextButtons: false,
        setGallerySize: true,
        // autoPlay: 1500,
        // autoPlay: true,
        // contain: true
        wrapAround: true
      })
    );
  }

  /**
   * Initializing homepage for desktop
   */
  function initDesktop() {
    initPopupHandlers();

    initSubSubMenu();

    const phrases = ["Hello", "Hi!", "Thank you", "How are you?"];
    initLangPageHeaderAnimation(phrases);

    galleries.push(
      prepareGallery(".hor-slider", {
        // options
        cellAlign: "center",
        percentPosition: false,
        draggable: ">1",
        pageDots: false,
        setGallerySize: false,
        // autoPlay: 1500,
        // autoPlay: true,
        // contain: true
        wrapAround: true
      })
    );

    // Gray baloon animation handler
    addBaloonAnimationHandler(
      ".article.article__left-image .button",
      ".article",
      "article_animation"
    );

    // Contacts baloon animation handler
    addBaloonAnimationHandler(
      ".contacts .button",
      ".contacts",
      "run-animation"
    );
  }

  /**
   * Initializing the circle animations with phrases flowing over the circle
   * @param {Array} aPhrases
   */
  function initLangPageHeaderAnimation(aPhrases) {}

  function Phrase(aPhrase, aDie) {
    let el,
      angle = 30;
    const text = aPhrase || "",
      angleStep = 0.2,
      die = aDie;

    const init = function() {
      el = document.createElement("div");
      el.classList.add("lang-phrase");
    };

    const move = function() {
      angle += angleStep;

      if (angle > 185) {
        die();
        return false;
      }
      return true;
    };

    const draw = function() {};

    const update = function() {
      if (move()) draw();
    };

    init();

    return this;
  }

  /**
   * Init popup handlers
   */
  function initPopupHandlers() {
    const popupContainer = document.querySelector(".pop-up-container");

    // Add handler to close popups by clicking on fading area arround popup
    if (!!popupContainer) {
      const fading = popupContainer.querySelector(".pop-up-container__fading");
      if (!!fading) fading.addEventListener("click", closePopups);
    }

    // Popup 'Message' init
    messagePopup = initPopupHadlers("#message-pop-up");

    // Popup 'contacts'
    preparePopup("#contacts-popup", "#contacts-cta", {
      type: "success",
      title: "Ваше сообщение успешно отправлено",
      button: {
        text: "Ок",
        event: function(e) {
          e.preventDefault();
          closePopups();
        }
      }
    });

    // Popup 'Trial lesson request'
    preparePopup("#trial-lesson-request-popup", "#trial-lesson-cta", {
      type: "success",
      title: "Ваша заявка отправлена",
      text: "В&nbsp;ближайшее время с&nbsp;вами свяжется наш менеджен",
      button: {
        text: "Ок",
        event: function(e) {
          e.preventDefault();
          closePopups();
        }
      }
    });

    // Popup 'CV application request'
    preparePopup("#cv-application-popup", "#cv-application-cta", {
      type: "success",
      title: "Ваше резюме успешно отправлено",
      text: "В&nbsp;ближайшее время с&nbsp;вами свяжется наш менеджен",
      button: {
        text: "Ок",
        event: function(e) {
          e.preventDefault();
          closePopups();
        }
      }
    });
  }

  /**
   * Strating any slider with 'Flickity' script
   * @param {string} aSelector - DOM element selector
   * @param {Object} aOptions - Object with gallery configuration
   */
  function prepareGallery(aSelector, aOptions) {
    var flkty = new Flickity(aSelector, aOptions);
    return flkty;
  }

  /**
   * We need to handle the hover event on the button '.article.article__left-image .button'
   * And toggle class '.article_animation' for the element '.article.article__left-image' (add / remove)
   * @param {string} aSelector - class selector for a button
   * @param {string} aContainer - class selector for a 'closest' parant element to toggle a class
   * @param {string} aTrigger - class to be toggled
   */
  function addBaloonAnimationHandler(aSelector, aContainer, aTrigger) {
    const buttons = document.querySelectorAll(aSelector);

    if (!buttons) return false;

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      button.addEventListener("mouseover", function(e) {
        animateBaloon(e, aContainer, aTrigger);
      });

      button.addEventListener("mouseout", function(e) {
        animateBaloon(e, aContainer, aTrigger);
      });
    }
  }

  /**
   *  Toggling a Class for an closest parent element
   * @param {Object} e - event
   * @param {string} aContainer - class selector for a 'closest' parant element to toggle a class
   * @param {string} aTrigger - class to be toggled
   */
  function animateBaloon(e, aSelector, aTrigger) {
    const article = e.target.closest(aSelector);

    if (!article) return false;

    if (e.type === "mouseover") {
      article.classList.add(aTrigger);
    } else {
      article.classList.remove(aTrigger);
    }
  }

  // Initializing
  init();
})();
