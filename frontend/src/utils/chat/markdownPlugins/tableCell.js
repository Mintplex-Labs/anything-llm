/**
 * Enables HTML rendering of child HTML in table cells - will strip any attribute tags
 * and inner content must be `inline` in between a td_open/td_close pair.
 * @param {import('markdown-it')} md
 */

export function TableCellHtmlPlugin(md) {
  // Replaces the inline token between td_open/td_close with a special html_table_cell type
  md.core.ruler.push("table_cell", (state) => {
    const hasInlineCellSig =
      state.tokens.find((t) => t.type === "inline") &&
      state.tokens.find((t) => t.type === "td_open");
    if (!hasInlineCellSig) return state;

    for (let i = 0; i < state.tokens.length; i++) {
      const { pre, cur, next } = {
        pre: state.tokens?.[i - 1] ?? null,
        cur: state.tokens[i],
        next: state.tokens?.[i + 1] ?? null,
      };

      if (
        pre?.type === "td_open" &&
        cur.type === "inline" &&
        next?.type === "td_close" &&
        cur.content.includes("<") &&
        (cur.content.includes(">") ||
          cur.content.includes("/>") ||
          cur.content.includes("</"))
      ) {
        let token = new state.Token("html_table_cell", null);
        token.content = cur.content;
        state.tokens[i].children = [token];
      }
    }

    return state;
  });

  // Handles rendering of the html_table_cell
  md.renderer.rules.html_table_cell = (tokens, idx) => {
    const token = tokens[idx];
    return token.content;
  };
}
