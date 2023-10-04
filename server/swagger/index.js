function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Force change the Swagger logo in the header
waitForElm('img[alt="Swagger UI"]').then((elm) => {
  if (window.SWAGGER_DOCS_ENV === 'development') {
    elm.src = 'http://localhost:3000/public/anything-llm.png'
  } else {
    elm.src = `${window.location.origin}/anything-llm.png`
  }
});