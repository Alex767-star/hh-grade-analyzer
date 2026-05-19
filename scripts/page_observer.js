(function() {
  'use strict';

  function waitForVacancy() {
    const checkInterval = setInterval(() => {
      const vacancyContent = document.querySelector('[data-qa="vacancy-description"]')
        || document.querySelector('.vacancy-description')
        || document.querySelector('.vacancy-section');
      
      if (vacancyContent) {
        clearInterval(checkInterval);
        injectGradeBadge();
      }
    }, 500);
    setTimeout(() => clearInterval(checkInterval), 10000);
  }

  function injectGradeBadge() {
    if (document.getElementById('hh-grade-badge')) return;

    const classifier = new window.GradeClassifier();
    const result = classifier.classify();
    
    const badge = document.createElement('div');
    badge.id = 'hh-grade-badge';
    badge.style.cssText = `
      margin: 12px 0;
      padding: 14px 16px;
      border-radius: 10px;
      background: ${getGradeColor(result.grade)};
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `;

    // Верхняя строка: иконка + грейд + уверенность
    const topRow = document.createElement('div');
    topRow.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 6px;';
    
    const icon = document.createElement('span');
    icon.textContent = getGradeIcon(result.grade);
    icon.style.fontSize = '28px';
    topRow.appendChild(icon);
    
    const gradeInfo = document.createElement('div');
    gradeInfo.style.display = 'flex';
    gradeInfo.style.flexDirection = 'column';
    
    const gradeText = document.createElement('span');
    gradeText.textContent = classifier.translateGrade(result.grade);
    gradeText.style.cssText = 'font-size: 18px; font-weight: 700;';
    gradeInfo.appendChild(gradeText);
    
    const confidenceText = document.createElement('span');
    confidenceText.textContent = `Уверенность: ${result.confidence}%${result.subLevel}`;
    confidenceText.style.cssText = 'font-size: 12px; opacity: 0.9; font-weight: 400;';
    gradeInfo.appendChild(confidenceText);
    
    topRow.appendChild(gradeInfo);
    badge.appendChild(topRow);

    // Нижняя строка: объяснение
    const explanationRow = document.createElement('div');
    explanationRow.style.cssText = `
      font-size: 11px;
      opacity: 0.85;
      line-height: 1.5;
      padding-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-weight: 400;
    `;
    explanationRow.textContent = result.explanation;
    badge.appendChild(explanationRow);

    // Анимация
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Внедрение
    const vacancyDesc = document.querySelector('[data-qa="vacancy-description"]');
    if (vacancyDesc && vacancyDesc.parentElement) {
      vacancyDesc.parentElement.insertBefore(badge, vacancyDesc);
    } else {
      const titleEl = document.querySelector('h1');
      if (titleEl && titleEl.parentElement) {
        titleEl.parentElement.insertBefore(badge, titleEl.nextSibling);
      }
    }

    saveToHistory(result);
  }

  function getGradeColor(grade) {
    const colors = {
      "intern": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "junior": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "middle": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "senior": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "lead": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    };
    return colors[grade] || colors["junior"];
  }

  function getGradeIcon(grade) {
    const icons = {
      "intern": "🎓",
      "junior": "🌱",
      "middle": "⚡",
      "senior": "🔥",
      "lead": "👑"
    };
    return icons[grade] || "📋";
  }

  function saveToHistory(result) {
    try {
      const url = window.location.href;
      const title = document.querySelector('[data-qa="vacancy-title"]')?.textContent 
        || document.querySelector('h1')?.textContent 
        || 'Unknown';
      
      chrome.storage.local.get(['vacancyHistory'], (data) => {
        const history = data.vacancyHistory || [];
        history.unshift({
          url, title: title.trim(), grade: result.grade,
          confidence: result.confidence, explanation: result.explanation,
          timestamp: Date.now()
        });
        chrome.storage.local.set({ vacancyHistory: history.slice(0, 100) });
      });
    } catch (e) {
      console.error('HH Analyzer: Failed to save history', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForVacancy);
  } else {
    waitForVacancy();
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      const oldBadge = document.getElementById('hh-grade-badge');
      if (oldBadge) oldBadge.remove();
      setTimeout(waitForVacancy, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();
