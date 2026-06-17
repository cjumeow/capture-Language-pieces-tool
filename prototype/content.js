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

  const markdownContext = contextSentence.replace(
    selectedText,
    `**${selectedText}**`,
  );

  const newPiece = {
    id: Date.now(),
    original_piece: selectedText,
    context: markdownContext,
    source_url: window.location.href,
    timestamp: new Date().toISOString(),
    status: "active",
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

function getSentenceContext(selection) {
  if (!selection || selection.isCollapsed) return "";

  const selectedText = selection.toString().trim();

  const range = selection.getRangeAt(0);

  let commonParent = range.commonAncestorContainer;
  if (commonParent.nodeType === Node.TEXT_NODE) {
    commonParent = commonParent.parentElement;
  }

  const fullText = commonParent.innerText;

  try {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    const segments = segmenter.segment(fullText);

    let matchedSentences = [];

    for (const { segment, index } of segments) {
      const segmentStart = index;
      const segmentEnd = index + segment.length;

      const selectionStart = fullText.indexOf(selectedText);
      const selectionEnd = selectionStart + selectedText.length;

      if (selectionStart < segmentEnd && selectionEnd > segmentStart) {
        matchedSentences.push(segment.trim());
      }
    }

    if (matchedSentences.length > 0) {
      return matchedSentences.join(" ");
    }
  } catch (e) {
    console.error("Intl.Segmenter processing failed:", e);
  }

  return selectedText;
}
