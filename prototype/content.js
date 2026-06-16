chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "trigger-save-piece") {
    handleCapture();
  }
});