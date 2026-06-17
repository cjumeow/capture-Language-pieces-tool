chrome.action.onClicked.addListener(async (tab) => {
  const dashboardUrl = chrome.runtime.getURL("dashboard.html");
  const tabs = await chrome.tabs.query({});
  const existingTab = tabs.find((t) => t.url === dashboardUrl);

  if (existingTab) {
    chrome.tabs.update(existingTab.id, { active: true });
    chrome.windows.update(existingTab.windowId, { focused: true });
  } else {
    chrome.tabs.create({ url: "dashboard.html" });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "save-piece-command") {
    let currentTab = { active: true, currentWindow: true };
    chrome.tabs.query(currentTab, (tabs) => {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "trigger-save-piece" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn(
                "Can't be executed for the current tab",
                chrome.runtime.lastError.message,
              );
            }
          },
        );
      }
    });
  }
});
