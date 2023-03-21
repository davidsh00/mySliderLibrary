document.addEventListener("DOMContentLoaded", () => {
  const sliders = [...document.getElementsByClassName("slider")];
  if (sliders.length > 0) {
    addSliderCss();

    sliders.forEach((slider) => {
      adjustSlider(slider);
      setSliderListeners(slider);
      setSliderAutoPlay(slider);
    });
  }
});

const createElem = (elemType, property, children) => {
  const elem = document.createElement(elemType || "div");
  for (const key in property) {
    elem[key] = property[key];
  }
  if (children && children.length > 0) {
    children.forEach((child) => {
      elem.append(child);
    });
  }
  return elem;
};

const addSliderCss = () => {
  const sliderCssTag = createElem("link", {
    href: `./slider.css`,
    rel: "stylesheet",
  });
  document.head.append(sliderCssTag);
};

const adjustSlider = (slider) => {
  const slides = getSliderActiveSlide(slider)[0];
  const sliderPrevElem = createElem(
    "button",
    {
      className: "slider__prev",
    },
    ["<"]
  );
  const sliderNextElem = createElem(
    "button",
    {
      className: "slider__next",
    },
    [">"]
  );
  const paginationChild = slides.map((item, i) => {
    if (i === 0) {
      return createElem("li", { className: "active" });
    }
    return createElem("li");
  });
  const sliderPagination = createElem(
    "ul",
    {
      className: "slider__pagination",
    },
    paginationChild
  );
  slides.forEach((slide, i) => {
    if (i === 0) {
      slide.classList.add("active");
      return;
    }
    slide.classList.remove("active");
  });

  const sliderPrev = slider.querySelector(".slider__prev") || sliderPrevElem;
  const sliderNext = slider.querySelector(".slider__next") || sliderNextElem;
  const sliderActions = createElem("div", { className: "slider__actions" }, [
    sliderPrev,
    sliderNext,
  ]);
  const sliderOverlay = createElem("div", { className: "slider__overlay" }, [
    sliderActions,
    sliderPagination,
  ]);

  slider.prepend(sliderOverlay);
};
const getSliderActiveSlide = (slider) => {
  const sliderList = [
    ...slider.querySelectorAll(".slider__slides>.slider__slide"),
  ];
  const activeSlide = sliderList.find((slide) =>
    slide.classList.contains("active")
  );

  const activeSlideNumber = sliderList.indexOf(activeSlide);
  return [sliderList, activeSlideNumber];
};
const setSliderListeners = (slider) => {
  const nextBtn = slider.querySelector(".slider__next");
  const prevBtn = slider.querySelector(".slider__prev");
  const paginationList = [...slider.querySelectorAll(".slider__pagination>li")];
  slider.addEventListener("mouseenter", () => {
    pauseSlider(slider);
  });
  slider.addEventListener("mouseleave", () => {
    slider.classList.remove("pause");
  });
  nextBtn.addEventListener("click", () => {
    console.log("next fired");
    setSliderSlide("next", slider);
  });
  prevBtn.addEventListener("click", () => {
    setSliderSlide("prev", slider);
  });
  paginationList.forEach((page, i) =>
    page.addEventListener("click", () => {
      setSliderSlide(i, slider);
    })
  );
};
const setSliderSlide = (slide, slider) => {
  const [slides, activeSlide] = getSliderActiveSlide(slider);
  const paginationItems = [
    ...slider.querySelectorAll(".slider__overlay>.slider__pagination>li"),
  ];
  switch (slide) {
    case "next": {
      setSlide(activeSlide + 1);
      break;
    }
    case "prev": {
      setSlide(activeSlide - 1);
      break;
    }
    default:
      setSlide(slide);
  }
  async function setSlide(slideNumber) {
    const number =
      slideNumber % slides.length < 0
        ? slides.length - 1
        : slideNumber % slides.length;
    console.log(`activeSlide${activeSlide}`, `go to slide : ${slideNumber}`);
    slides[activeSlide].classList.remove("active");
    slides[number].classList.add("active");

    paginationItems.forEach((item) => item.classList.remove("active"));
    paginationItems[number].classList.add("active");
  }
};
const setSliderAutoPlay = (slider) => {
  setTimeout(() => {
    setSliderAutoPlay(slider);
    if (!slider.classList.contains("pause")) {
      setSliderSlide("next", slider);
    }
  }, 2000);
};
const pauseSlider = (slider) => {
  slider.classList.add("pause");
};
