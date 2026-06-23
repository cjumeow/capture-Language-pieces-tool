import { escapeRegExp } from '../core/utils.js';
import { state } from "../core/states.js";
import { filterByDate } from "../core/filter.js";
import { deletePiece, updateNote } from "../core/actions.js";

export function renderView() {
  const container = document.getElementById("pieces-list");
  container.innerHTML = "";

  let filtered = filterByDate(state.allPieces, state.selectedDateRange);

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No pieces collected in this range.</div>';
    return;
  }

  filtered.sort((a, b) => b.id - a.id);
  renderPieceList(filtered, container);
}

function renderPieceList(pieces, container) {
  pieces.forEach((piece) => {
    const pieceEl = document.createElement("div");
    pieceEl.className = "piece-item";

    const boldContext = piece.context.replace(
      new RegExp(`(${escapeRegExp(piece.original_piece)})`, "gi"),
      "<b>$&</b>",
    );

    pieceEl.innerHTML = `
      <div class="front-section">
        <p class="context-text">${boldContext}</p>
      </div>
      <div class="back-section">
        <textarea class="markdown-editor" data-id="${piece.id}" 
          placeholder="Note something about your selected text...">${piece.user_note || piece.original_piece}</textarea>
        <div class="piece-footer">
          <a href="${piece.source_url}" target="_blank" class="source-link">View original page</a>
          <button class="delete-btn" data-id="${piece.id}">delete</button>
        </div>
      </div>
    `;

    const textarea = pieceEl.querySelector(".markdown-editor");
    textarea.addEventListener("input", (e) => {
      updateNote(piece.id, e.target.value);
    });

    const deleteBtn = pieceEl.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      deletePiece(piece.id);
    });

    container.appendChild(pieceEl);
  });
}
