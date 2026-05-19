document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadHistory();
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'clearHistory' }, () => {
      loadStats();
      loadHistory();
    });
  });
});

function loadStats() {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (data) => {
    const history = data?.vacancyHistory || [];
    document.getElementById('totalCount').textContent = history.length;
    
    // Считаем за сегодня
    const today = new Date().setHours(0, 0, 0, 0);
    const todayCount = history.filter(item => item.timestamp > today).length;
    document.getElementById('todayCount').textContent = todayCount;
  });
}

function loadHistory() {
  chrome.runtime.sendMessage({ action: 'getHistory' }, (data) => {
    const history = data?.vacancyHistory || [];
    const listEl = document.getElementById('historyList');
    
    if (history.length === 0) {
      listEl.innerHTML = '<div class="empty-state">Нет данных. Откройте вакансию на hh.ru</div>';
      return;
    }
    
    listEl.innerHTML = history.slice(0, 20).map(item => `
      <div class="history-item">
        <div style="flex: 1; min-width: 0;">
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.title)}</div>
          <div style="font-size: 10px; color: #888; margin-top: 2px;">
            ${new Date(item.timestamp).toLocaleString('ru-RU')} · ${item.confidence}%
          </div>
        </div>
        <span class="grade-badge grade-${item.grade}">${translateGrade(item.grade)}</span>
      </div>
    `).join('');
  });
}

function translateGrade(grade) {
  const map = {
    'intern': '🎓 Intern',
    'junior': '🌱 Junior',
    'middle': '⚡ Middle',
    'senior': '🔥 Senior',
    'lead': '👑 Lead'
  };
  return map[grade] || grade;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
