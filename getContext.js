function getSentenceContext(selection) {
  if (!selection || selection.isCollapsed) return "";

  const range = selection.getRangeAt(0); // range: { startContainer, startOffset, endContainer, endOffset }

  const blockParent = getClosestBlockContainer(range.commonAncestorContainer);
  if (!blockParent) return selection.toString().trim();

  const fullText = blockParent.textContent;

  const { start: selectStart, end: selectEnd } = getSelectionOffsets(
    blockParent,
    range,
  );

  try {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

    const segments = segmenter.segment(fullText);

    let matchedSentences = [];

    for (const { segment, index } of segments) {
      const segmentStart = index;
      const segmentEnd = index + segment.length;

      // check if the selection overlaps with the current segment
      if (selectStart < segmentEnd && selectEnd > segmentStart) {
        const originalSegment = fullText.slice(segmentStart, segmentEnd);
        matchedSentences.push(originalSegment.trim());
      }
    }

    if (matchedSentences.length > 0) {
      return matchedSentences.join(" ");
    }
  } catch (e) {
    console.error("Intl.Segmenter processing failed:", e);
  }

  return selection.toString().trim();
}

function getClosestBlockContainer(node) {
  let element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  const inlineTags = new Set([
    "A",
    "SPAN",
    "CODE",
    "B",
    "I",
    "STRONG",
    "EM",
    "U",
    "SUB",
    "SUP",
    "SMALL",
  ]);

  while (element && element.parentElement) {
    if (!inlineTags.has(element.tagName)) {
      return element;
    }
    element = element.parentElement;
  }
  return element || document.body;
}

function getSelectionOffsets(blockElement, range) {
  let startOffset = 0;
  let endOffset = 0;
  let foundStart = false;
  let foundEnd = false;

  const treeWalker = document.createTreeWalker(
    blockElement,
    NodeFilter.SHOW_TEXT,
  );

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (node === range.startContainer) {
      startOffset += range.startOffset;
      foundStart = true;
    } else if (!foundStart) {
      startOffset += node.textContent.length;
    }

    if (node === range.endContainer) {
      endOffset += range.endOffset;
      foundEnd = true;
      break;
    } else if (!foundEnd) {
      endOffset += node.textContent.length;
    }
  }

  return { start: startOffset, end: endOffset };
}


