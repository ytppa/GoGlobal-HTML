import "modern-css-reset";

import Flickity from "flickity";
import "flickity/dist/flickity.css";

import mobile from "is-mobile";

import { animationsLarge } from "../../components/animatronix/animations-large.js";
import { animationsMedium } from "../../components/animatronix/animations-medium.js";
import { bodyBg } from "../../components/bodyBg/bodyBg_desktop.js";
import { initSubSubMenu } from "../../components/nav/nav_desktop.js";
import { initMobileNav } from "../../components/nav/nav_mobile.js";

import {
  preparePopup,
  closePopups,
  initPopupHadlers,
  showMessagePopup
} from "../../components/popup/popup.js";

const isMobile = mobile(); // ? is Mobile

let animations;
const animationsBase = {
  medium: animationsMedium,
  large: animationsLarge
};

if (isMobile) {
  require("./styles-mobile.scss");
} else {
  require("./styles-desktop.scss");
}

(function() {
  let currentFrame = 0,
    galleries = [],
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

    // Language baloons need to be prepared before making a slider
    prepareLangBaloonsForSlider();
    const languageBaloonsSlider = prepareGallery(
      ".language-baloons__container",
      {
        // options
        cellAlign: "left",
        percentPosition: false,
        draggable: ">2",
        pageDots: false,
        prevNextButtons: false,
        setGallerySize: true,
        // autoPlay: 1500,
        // autoPlay: true,
        // contain: true
        wrapAround: true,
        groupCells: 2,
        on: {
          change: hideSwipeHandIcon
        }
      }
    );
    // languageBaloonsSlider.ones("change", hideSwipeHandIcon);

    galleries.push(languageBaloonsSlider);

    // Posessing red line according to the position of section marked as `.red-line-trigger`
    let redLineTrigger = document.querySelector(".red-line-trigger");
    if (!!redLineTrigger) {
      let top = redLineTrigger.offsetTop;

      document.body.style.backgroundPosition = `center top, center ${top -
        1850}px`;
    }
  }

  /**
   * Hiding swipe hand icon when user starts scrolling the slider
   */
  function hideSwipeHandIcon() {
    const icon = document.querySelector(".language-baloons__hand-icon");
    if (!!icon) icon.style.display = "none";
  }

  /**
   * Initializing homepage for desktop
   */
  function initDesktop() {
    // Starting whole animation
    requestAnimationFrame(animate);

    initPopupHandlers();

    initSubSubMenu();

    bodyBg.init();
    // startWindowScrollHandling();

    // Starting baloon animation
    let langBaloonsEl = document.querySelector(".language-baloons");
    langBaloonsEl.className = "language-baloons run-baloon-animation";

    // Starting sliders

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

    // Yellow baloon animation handler
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

    windowSize = getWindowSize();
    animations = animationsBase[windowSize];
    window.onresize = function() {
      resizeHandler();
    };
  }

  /**
   * On mobile device we need to group language baloons by two pieces at ones
   */
  function prepareLangBaloonsForSlider() {
    const container = document.querySelector(".language-baloons__container");
    if (!container) return false;

    const baloons = container.querySelectorAll(".language-baloon");
    if (!baloons) return false;

    for (let i = 0; i < baloons.length; i++) {
      if (i % 2 === 0) {
        let section = createSection();

        section.prepend(baloons[i]);

        if (i + 1 < baloons.length) {
          section.prepend(baloons[i + 1]);
        }

        container.prepend(section);
      }
    }

    function createSection() {
      const section = document.createElement("div");
      section.classList.add("language-baloons__section");
      return section;
    }
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
   * Handling window resize event to restart animations
   */
  function resizeHandler() {
    let currentWindowSize = getWindowSize();
    console.log(currentWindowSize);
    if (currentWindowSize !== windowSize) {
      reInit(currentWindowSize);
    }
  }

  /**
   * Restarting the homepage animations
   * @param {number} aNewWindowSize
   */
  function reInit(aNewWindowSize) {
    windowSize = aNewWindowSize;

    animations = animationsBase[windowSize];

    // Restartin' Cube animation
    currentFrame = 0; // Rewinding current kayframe to the beginning
    requestAnimationFrame(animate);

    // Restartin' baloons animation
    let langBaloonsEl = document.querySelector(".language-baloons");
    if (!!langBaloonsEl) {
      langBaloonsEl.className = "language-baloons";
      setTimeout(function() {
        langBaloonsEl.className = "language-baloons run-baloon-animation";
      }, 10);
    }
  }

  /**
   * Figuring out if the screen is wider than 1280 or not
   *
   * @returns: 'medium' for screen width equals or smaller than 1280
   * otherwize return 'large'
   */
  function getWindowSize() {
    let w = window.innerWidth;
    if (w <= 1280) {
      return "medium";
    }

    return "large";
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
   * Updating 'd' attribute in <path> tags in all <SVG> elements
   */
  function animate() {
    animations.items.forEach(item => {
      const { id, paths, keyframes } = item;
      let element = document.getElementById(id);

      if (element === undefined || element === null) return false;

      if (paths !== undefined && paths !== null) {
        // Updating all the paths of <SVG>
        paths.forEach(e => {
          let path = element.querySelector(`.${e.name}`);
          if (path !== null) {
            const currentPathD = getCurrentPath(e.frames);
            // if (e.name === "side") console.log(currentPathD);
            path.setAttribute("d", currentPathD);
          }
        });
      }

      if (keyframes !== undefined && keyframes !== null) {
        let styleProps = getCurrentStyleProps(keyframes);
        styleProps.forEach(styleProp => {
          element.style[styleProp.name] = styleProp.value + styleProp.postfix;
        });
      }
    });

    // Preparing and planing next frame
    currentFrame += 1;
    if (currentFrame > animations.duration) {
      finishAnimation();
      return false;
    }

    requestAnimationFrame(animate);
    return true;
  }

  /**
   * When animation is over
   */
  function finishAnimation() {
    // Preventing baloons from Hover effect
    setTimeout(function() {
      const languageBaloonsWaiter = document.querySelector(
        ".language-baloons__waiter"
      );
      if (!!languageBaloonsWaiter) languageBaloonsWaiter.style.display = "none";
      console.log("~ Ready");
    }, 2000);
  }

  /**
   * Getting the keyFrame that is on the LEFT side from current frame
   * @param {number} a
   * @param {number} b
   */
  function getLeftFrame(a, b) {
    if (currentFrame === b.f) {
      if (a.f === currentFrame) return b;
      if (a.f < currentFrame) return a;
    } else if (a.f <= currentFrame && b.f > currentFrame) return a;
    return b;
  }

  /**
   * Getting the keyFrame that is on the RIGHT side from current frame
   * @param {number} a
   * @param {number} b
   */
  function getRightFrame(a, b) {
    return a.f >= currentFrame ? a : b;
  }

  /**
   * Returns a value for 'd' attribute of the path
   * @param {Object[]} aFrames - Array of key frames
   * @param {number} aFrames[].f - Key frame number (0-100)
   * @param {Object} aFrames[].d - Dots
   * @param {number} aFrames[].d[].x - 'x' coordinates
   * @param {number} aFrames[].d[].y - 'y' coordinates
   */
  function getCurrentPath(aFrames) {
    let pathD = "",
      dots = [],
      rightFrame = aFrames.reduce(getRightFrame),
      leftFrame = aFrames.reduce(getLeftFrame);

    if (rightFrame === leftFrame) rightFrame = aFrames[1];

    for (let i = 0; i < leftFrame.d.length; i += 1) {
      const x1 = leftFrame.d[i].x,
        y1 = leftFrame.d[i].y,
        x2 = rightFrame.d[i].x,
        y2 = rightFrame.d[i].y,
        step = (currentFrame - leftFrame.f) / (rightFrame.f - leftFrame.f);

      const x = x1 + (x2 - x1) * step;
      const y = y1 + (y2 - y1) * step;
      dots.push({ x: x, y: y });
    }

    pathD += "M";

    dots.forEach(dot => {
      pathD += `${dot.x} ${dot.y}L`;
    });
    pathD += `${dots[dots.length - 1].x} ${dots[dots.length - 1].y}Z`;
    return pathD;
  }

  /**
   * preparing an array fo style parametres for the current key frame
   * @param {Object[]} aKeyFrames - Frames for usual animation
   * @param {number} aKeyFrames[].f - Key frame number (0-100)
   * @param {Object} aKeyFrames[].d - Key frame sate
   * @param {string} aKeyFrames[].d[].name - Style name
   * @param {number} aKeyFrames[].d[].value - Style value
   * @param {string?} aKeyFrames[].d[].postfix - Value postfix
   */
  function getCurrentStyleProps(aKeyFrames) {
    let styleProps = [],
      rightFrame = aKeyFrames.reduce(getRightFrame),
      leftFrame = aKeyFrames.reduce(getLeftFrame);

    if (rightFrame === leftFrame) rightFrame = aKeyFrames[1];

    for (let i = 0; i < leftFrame.styleProps.length; i += 1) {
      const step = (currentFrame - leftFrame.f) / (rightFrame.f - leftFrame.f),
        styleProp1 = leftFrame.styleProps[i],
        styleProp2 = rightFrame.styleProps[i];

      const styleProp = {
        name: styleProp1.name,
        value: styleProp1.value + (styleProp2.value - styleProp1.value) * step,
        postfix: styleProp1.postfix !== undefined ? styleProp1.postfix : ""
      };

      styleProps.push(styleProp);
    }

    return styleProps;
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
