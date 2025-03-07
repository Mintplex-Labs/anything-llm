import DOMPurify from "dompurify";

// DOMPurify 설정: 인용 링크 클릭을 허용하도록 설정
DOMPurify.addHook("afterSanitizeAttributes", function(node) {
  // citation-link 클래스를 가진 링크만 처리
  if (node.tagName === 'A' && node.classList.contains('citation-link')) {
    // data-citation-index 속성 유지
    const citationIndex = node.getAttribute('data-citation-index');
    if (citationIndex) {
      // 클릭 이벤트용 커스텀 데이터 속성 설정
      node.setAttribute('data-citation-index', citationIndex);
      // href는 안전하게 # 으로 설정
      node.setAttribute('href', '#');
    }
  }
});

export default DOMPurify;
