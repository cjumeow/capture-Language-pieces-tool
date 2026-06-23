import { state } from './states.js';
import { getPieces, updateNoteInStorage, deletePieceFromStorage, updateStatusInStorage, savePieces } from './storage.js';

export async function loadInitialData() {
  const pieces = await getPieces();
  
  const cleanedPieces = pieces.map(p => ({
    ...p,
    context: p.context || p.original_piece || "", 
    status: p.status || "undone",
    user_note: p.user_note || "", 
  }));
  
  state.setPieces(cleanedPieces);
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

export async function toggleStatus(id) {
  const piece = state.allPieces.find(p => p.id === id);
  if (!piece) return;

  const newStatus = piece.status === 'done' ? 'undone' : 'done';
  await updateStatusInStorage(id, newStatus);
  // ｕpdate the state in memory
  const updatedPieces = state.allPieces.map(p =>
    p.id === id ? { ...p, status: newStatus } : p
  );
  state.setPieces(updatedPieces, true); // true to avoid notifying subscribers again
}