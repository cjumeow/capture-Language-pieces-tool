chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "trigger-save-piece") {
    handleCapture();
  }
});

async function handleCapture() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) {
    console.log("No text selected.");
    return;
  }

  const contextSentence = getSentenceContext(selection);

  const newPiece = {
    id: Date.now(),
    original_piece: selectedText,
    context: contextSentence || selectedText,
    source_url: window.location.href,
    timestamp: new Date().toISOString(),
    status: "undone",
  };

  try {
    const result = await chrome.storage.local.get({ pieces: [] });
    const updatedPieces = [...result.pieces, newPiece];
    await chrome.storage.local.set({ pieces: updatedPieces });

    console.log("Piece saved successfully:", newPiece);
    // Can provide visual feedback when the save succeeds.
  } catch (error) {
    console.error("Error saving piece:", error);
  }
}

