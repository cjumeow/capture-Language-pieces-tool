export async function getPieces() {
  const result = await chrome.storage.local.get({ pieces: [] });
  return result.pieces;
}

export async function savePieces(pieces) {
  await chrome.storage.local.set({ pieces });
}

export async function updateNoteInStorage(id, newNote) {
  const pieces = await getPieces();
  const updated = pieces.map((p) =>
    p.id === id ? { ...p, user_note: newNote } : p,
  );
  await savePieces(updated);
  return updated;
}

export async function deletePieceFromStorage(id) {
  const pieces = await getPieces();
  const updated = pieces.filter((p) => p.id !== id);
  await savePieces(updated);
  return updated;
}

export async function updateStatusInStorage(id, newStatus) {
  const pieces = await getPieces();
  const updated = pieces.map((p) =>
    p.id === id ? { ...p, status: newStatus } : p,
  );
  await savePieces(updated);
  return updated;
}
