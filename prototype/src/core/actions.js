import { state } from './states.js';
import { getPieces, updateNoteInStorage, deletePieceFromStorage } from './storage.js';

export async function loadInitialData() {
  const pieces = await getPieces();
  state.setPieces(pieces);
}

export async function deletePiece(id) {
  if (confirm("Are you sure you want to delete this piece?")) {
    const updated = await deletePieceFromStorage(id);
    state.setPieces(updated);
  }
}

export async function updateNote(id, newNote) {
  const updated = await updateNoteInStorage(id, newNote);
  state.setPieces(updated, true); // true to avoid notifying subscribers again
}

export function setDateRange(range) {
  state.setDateRange(range);
}

