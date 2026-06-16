chrome.commands.onCommand.addListener((command) => {
  if (command === "save-piece-command") {
    let currentTab = { active: true, CurrentWindow: true };
    chrome.tabs.query(currentTab, (tabs) => {
      let activeTab = tabs;
      if (activeTab) {
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
