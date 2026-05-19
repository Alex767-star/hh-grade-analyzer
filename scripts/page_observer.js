// Наблюдатель страницы и UI-инжектор
(function() {
  'use strict';

  // Ждем полной загрузки страницы
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

    // Таймаут 10 секунд
    setTimeout(() => clearInterval(checkInterval), 10000);
  }

  // Внедрение бейджа с уровнем
  function injectGradeBadge() {
    // Проверяем, не внедрен ли уже
    if (document.getElementById('hh-grade-badge')) return;

    const classifier = new window.GradeClassifier();
    const result = classifier.classify();
    
    // Создаем бейдж
    const badge = document.createElement('div');
    badge.id = 'hh-grade-badge';
    badge.style.cssText = `
      margin: 12px 0;
      padding: 12px 16px;
      border-radius: 8px;
      background: ${getGradeColor(result.grade)};
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideIn 0.3s ease-out;
    `;

    // Иконка
    const icon = document.createElement('span');
    icon.textContent = getGradeIcon(result.grade);
    icon.style.fontSize = '24px';
    badge.appendChild(icon);

    // Текст
    const textDiv = document.createElement('div');
    textDiv.style.display = 'flex';
    textDiv.style.flexDirection = 'column';
    textDiv.style.gap = '2px';
    
    const gradeText = document.createElement('span');
    gradeText.textContent = classifier.translateGrade(result.grade);
    gradeText.style.fontSize = '16px';
    gradeText.style.fontWeight = '700';
    textDiv.appendChild(gradeText);
    
    const detailText = document.createElement('span');
    detailText.textContent = `Уверенность: ${result.confidence}%${result.subLevel}`;
    detailText.style.fontSize = '12px';
    detailText.style.opacity = '0.9';
    detailText.style.fontWeight = '400';
    textDiv.appendChild(detailText);

    badge.appendChild(textDiv);

    // Добавляем анимацию
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Внедряем в страницу
    const targetSelector = '[data-qa="vacancy-description"]';
    const vacancyDesc = document.querySelector(targetSelector);
    
    if (vacancyDesc && vacancyDesc.parentElement) {
      vacancyDesc.parentElement.insertBefore(badge, vacancyDesc);
    } else {
      // Fallback: ищем заголовок вакансии
      const titleEl = document.querySelector('h1');
      if (titleEl && titleEl.parentElement) {
        titleEl.parentElement.insertBefore(badge, titleEl.nextSibling);
      }
    }

    // Сохраняем в storage для истории
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
          url: url,
          title: title.trim(),
          grade: result.grade,
          confidence: result.confidence,
          timestamp: Date.now()
        });
        
        // Храним последние 100 записей
        const trimmed = history.slice(0, 100);
        chrome.storage.local.set({ vacancyHistory: trimmed });
      });
    } catch (e) {
      console.error('HH Analyzer: Failed to save history', e);
    }
  }

  // Запуск при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForVacancy);
  } else {
    waitForVacancy();
  }

  // Повторный анализ при SPA-навигации
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      // Удаляем старый бейдж
      const oldBadge = document.getElementById('hh-grade-badge');
      if (oldBadge) oldBadge.remove();
      // Ждем новый контент
      setTimeout(waitForVacancy, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

})();
