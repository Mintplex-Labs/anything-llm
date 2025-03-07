import DOMPurify from "dompurify";

// DOMPurify 설정
DOMPurify.setConfig({
  ADD_ATTR: ['target', 'rel', 'data-citation-index']
});

// 외부 링크 처리를 위한 훅
DOMPurify.addHook("afterSanitizeAttributes", function(node) {
  // A 태그에 대해 target과 rel 속성 설정
  if (node.tagName === 'A' && node.getAttribute('href') && !node.hasAttribute('target')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export default DOMPurify;
