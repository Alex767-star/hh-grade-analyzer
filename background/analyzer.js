// Фоновый скрипт
chrome.runtime.onInstalled.addListener(() => {
  console.log('[HH Analyzer] Extension installed');
  chrome.storage.local.set({ 
    totalAnalyzed: 0,
    vacancyHistory: []
  });
});

// Прием сообщений от контент-скрипта
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHistory') {
    chrome.storage.local.get(['vacancyHistory', 'totalAnalyzed'], (data) => {
      sendResponse(data);
    });
    return true;
  }
  
  if (request.action === 'clearHistory') {
    chrome.storage.local.set({ 
      vacancyHistory: [],
      totalAnalyzed: 0
    });
    sendResponse({ success: true });
    return true;
  }
});
