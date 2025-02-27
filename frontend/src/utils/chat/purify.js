import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);
DOMPurify.setConfig({
  ADD_ATTR: ["target", "rel"],
});

export default DOMPurify;
