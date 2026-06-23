import { escapeRegExp } from "../core/utils.js";
import { state } from "../core/states.js";
import { filterByDate } from "../core/filter.js";
import { deletePiece, updateNote, toggleStatus } from "../core/actions.js";

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

    const safeContext = piece.context || piece.original_piece || ""; 
    const boldContext = safeContext.replace(
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
          <div class="footer-actions">
            <button class="status-btn" data-id="${piece.id}">
              ${piece.status === "done" ? "undone" : "done"}
            </button>
            <button class="delete-btn" data-id="${piece.id}">delete</button>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners for the textarea, delete button, and status button
    const textarea = pieceEl.querySelector(".markdown-editor");
    textarea.addEventListener("input", (e) => {
      updateNote(piece.id, e.target.value);
    });

    const deleteBtn = pieceEl.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      deletePiece(piece.id);
    });

    const statusBtn = pieceEl.querySelector(".status-btn");
    statusBtn.addEventListener("click", async (e) => {
      const currentPiece = state.allPieces.find((p) => p.id === piece.id);
      if (!currentPiece) return;
      const newStatus = currentPiece.status === "done" ? "undone" : "done";
      statusBtn.textContent = newStatus === "done" ? "undone" : "done";
      await toggleStatus(piece.id);
    });

    container.appendChild(pieceEl);
  });
}
