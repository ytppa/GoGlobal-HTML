/**
 *
 * POP-UP managements
 *
 */

/**
 * Preparing popup
 * @param {string} aPopupSelector
 * @param {string} aCtaSelector
 * @param {Object} aMessage
 * @param {string} aMessage.type
 * @param {string} aMessage.title
 * @param {string} aMessage.text
 * @param {?Object} aMessage.button
 */
function preparePopup(aPopupSelector, aCtaSelector, aMessage) {
  const popup = initPopupHadlers(aPopupSelector);
  const cta = document.querySelector(aCtaSelector);
  if (!!cta) {
    cta.addEventListener("click", function(e) {
      e.preventDefault();
      popup.show();
    });
  }
  // Debugging the success message popup
  const applyCVApplicationButton = document.querySelector(
    `${aPopupSelector} .button`
  );
  if (!!applyCVApplicationButton) {
    applyCVApplicationButton.addEventListener("click", function(e) {
      e.preventDefault();
      showMessagePopup(aMessage);
    });
  }
}

/**
 * Close all popups
 */
function closePopups() {
  const popupContainer = document.querySelector(".pop-up-container");
  if (!!popupContainer)
    popupContainer.classList.remove("pop-up-container_opened");
}

/**
 * Prepare popup controls
 * @param {string} aPopupSelector - Pop-up's CSS selector
 */
function initPopupHadlers(aPopupSelector) {
  let obj = {
    popup: null,
    container: null,
    closeButton: null,
    show: function() {
      const { container, popup } = this,
        openedPopupClass = "pop-up_opened",
        openedPopupContainerClass = "pop-up-container_opened";

      // Closing all opened popups
      const popups = container.querySelectorAll(".pop-up");
      if (!popups) return false;

      for (let i = 0; i < popups.length; i++) {
        const p = popups[i];
        p.classList.remove(openedPopupClass);
      }

      // Making popup container visible
      container.classList.add(openedPopupContainerClass);

      // Displaying popup
      popup.classList.add(openedPopupClass);
    },
    hide: function() {},
    init: function(aPopupSelector) {
      this.popup = document.querySelector(aPopupSelector);
      if (!this.popup) return false;

      this.container = this.popup.closest(".pop-up-container");
      this.closeButton = this.popup.querySelector(".pop-up__close-icon");

      this.popup.addEventListener("click", function(e) {
        e.preventDefault();
      });

      if (!!this.closeButton)
        this.closeButton.addEventListener("click", function(e) {
          e.preventDefault();
          closePopups();
        });

      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
    }
  };

  obj.init(aPopupSelector);

  return obj;
}

/**
 * Displaying the message popup
 * @param {Object} aMessage
 * @param {string} aMessage.type - expected values: 'success', 'fail', 'alert'. (For now only the 'success' is implemented)
 * @param {string} aMessage.title
 * @param {string} aMessage.text
 * @param {?Object} aMessage.button
 * @param {?string} aMessage.button.text
 * @param {?function} aMessage.button.event
 * Example:
 *   message = {
 *     type: 'success',
 *     title: 'Ваше резюме успешно отправлено',
 *     text: 'В&nbsp;ближайшее время с&nbsp;вами свяжется наш менеджен',
 *   }
 */
function showMessagePopup(aMessage) {
  const popup =
    typeof messagePopup !== "undefined" && !!messagePopup.popup
      ? messagePopup.popup
      : document.querySelector("#message-pop-up");
  if (!popup) return false;

  // Message type
  popup.classList.remove("pop-up_message-success");
  popup.classList.remove("pop-up_message-fail");
  popup.classList.remove("pop-up_message-alert");
  popup.classList.add(`pop-up_message-${aMessage.type}`);

  // Message Title
  const title = popup.querySelector(".pop-up__message h4");
  if (!!title) title.innerHTML = aMessage.title;

  // Message text
  const text = popup.querySelector(".pop-up__message p");
  if (!!aMessage.text && !!text) {
    text.innerHTML = aMessage.text;
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }

  // Button
  if (aMessage.button) {
    const button = popup.querySelector(".button");
    if (!!button) {
      if (aMessage.button.text) button.innerHTML = aMessage.button.text;
      if (aMessage.button.event)
        button.addEventListener("click", aMessage.button.event);
    }
  }

  if (typeof messagePopup !== "undefined" && !!messagePopup.popup) {
    messagePopup.show();
  } else {
    let messagePopupTemp = initPopupHadlers("#message-pop-up");
    messagePopupTemp.show();
  }
}

export { preparePopup, closePopups, initPopupHadlers, showMessagePopup };
