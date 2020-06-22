/*
<body>
  <div class="body-bg body-bg_red-line"></div>
  <div class="body-bg body-bg_white-line"></div>
  <div class="body-bg body-bg_yellow-line"></div>
  ...
</body>

let pageYOffset = window.pageYOffset;

*/

const bodyBg = {
  isMoving: false,
  config: {
    elements: [
      {
        domElement: null,
        classNames: ["body-bg", "body-bg_yellow-line"],
        offset: 0,
        states: {
          hide: [{ name: "backgroundPositionY", value: -2800, postfix: "px" }],
          show: [{ name: "backgroundPositionY", value: 0, postfix: "px" }]
        },
        target: null,
        timing: 1,
        step: 1
      },
      {
        domElement: null,
        classNames: ["body-bg", "body-bg_white-line"],
        offset: 1500,
        states: {
          hide: [{ name: "backgroundPositionY", value: -1500, postfix: "px" }],
          show: [{ name: "backgroundPositionY", value: 1080, postfix: "px" }]
        },
        target: null,
        timing: 1,
        step: 1
      },
      {
        domElement: null,
        classNames: ["body-bg", "body-bg_red-line"],
        offset: 2300,
        states: {
          hide: [{ name: "backgroundPositionY", value: -2000, postfix: "px" }],
          show: [{ name: "backgroundPositionY", value: 2550, postfix: "px" }]
        },
        target: null,
        timing: 1,
        step: 0.5
      }
    ]
  },

  // Инициализация
  init: function() {
    this.createElements();
    this.scrollHandler();
    window.addEventListener("scroll", this.scrollHandler.bind(this));

    require("./bodyBg_desktop.scss");
  },

  // Создаем необходимые элементы, определяем положение элементов
  createElements: function() {
    const pageYOffset = window.pageYOffset;

    for (let i = 0; i < this.config.elements.length; i++) {
      const element = this.config.elements[i];
      const el = document.createElement("div");
      let target;

      el.classList.add(...element.classNames);

      if (pageYOffset >= element.offset) {
        target = "show";
      } else {
        target = "hide";
      }

      this.config.elements[i].target = target;
      for (let k = 0; k < element.states[target].length; k++) {
        const styleParam = element.states[target][k];

        el.style[styleParam.name] = styleParam.value + styleParam.postfix;
      }

      document.body.prepend(el);

      this.config.elements[i].domElement = el;
    }
  },

  // Реакция на скролл (запускаем анимацию, если поменялось направление (hide / show) хоть у одного объекта)
  scrollHandler: function() {
    let needToMove = false;
    for (let i = 0; i < this.config.elements.length; i++) {
      if (this.updateConfigElement(i)) needToMove = true;
    }
    if (needToMove) this.continue();
  },

  // Актуализируем "направления", вернем true, если движения не было и появилось.
  updateConfigElement: function(aIndex) {
    const el = this.config.elements[aIndex],
      pageYOffset = window.pageYOffset,
      wasMoving = this.isMoving;
    let needToMove = false;

    // What is the current `direction`?
    const targetState = pageYOffset < el.offset ? "hide" : "show";

    // Reverse if needed
    if (targetState !== el.target) {
      needToMove = true;
      this.config.elements[aIndex].target = targetState;
      this.config.elements[aIndex].timing =
        1 - this.config.elements[aIndex].timing;
    }

    if (!wasMoving && needToMove) return true;

    return false;
  },

  // Повторяем
  continue: function() {
    this.isMoving = true;
    window.requestAnimationFrame(this.doMoves.bind(this));
  },

  // Двигаем все, что нужно двигать
  doMoves: function() {
    let needToContinue = false;
    for (let i = 0; i < this.config.elements.length; i++) {
      if (this.doSteps(i)) needToContinue = true;
      this.updateElementStyles(i);
    }

    if (needToContinue) this.continue();
    else this.isMoving = false;
  },

  // Сдвинем timing для элемента aIndex
  doSteps: function(aIndex) {
    let needToMove = false;

    let { timing, step } = this.config.elements[aIndex];
    timing += step;

    if (timing >= 1) timing = 1;
    else needToMove = true;

    this.config.elements[aIndex].timing = timing;

    return needToMove;
  },

  // Корректирует конечное положение объекта
  updateElementStyles: function(aIndex) {
    const { domElement, states, target, timing } = this.config.elements[aIndex];

    for (let j = 0; j < states[target].length; j++) {
      const moveTo = states[target][j],
        moveFrom = target === "hide" ? states["show"][j] : states["hide"][j];

      domElement.style[moveTo.name] =
        moveFrom.value +
        (moveTo.value - moveFrom.value) * this.easeOutQuart(timing) +
        moveTo.postfix;
    }
  },

  // Вычисление положения с учетом easing функции
  easeOutQuart: function(x) {
    return x;
    // return 1 - Math.pow(1 - x, 4);
  }
};

export { bodyBg };
