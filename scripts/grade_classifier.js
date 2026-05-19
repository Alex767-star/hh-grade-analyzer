// Основной классификатор уровня вакансии
class GradeClassifier {
  constructor() {
    this.patterns = window.GRADE_PATTERNS;
    this.titleDB = window.VACANCY_TITLE_DB;
    this.skillsDB = window.SKILLS_BY_GRADE;
    this.contextPhrases = window.CONTEXT_PHRASES;
  }

  extractVacancyText() {
    const selectors = [
      '[data-qa="vacancy-description"]',
      '.vacancy-description',
      '.vacancy-section',
      '.g-user-content',
      '[data-qa="vacancy-view"]',
      '.vacancy-branded-user-content'
    ];
    let text = '';
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => text += ' ' + el.textContent);
    }
    const titleEl = document.querySelector('[data-qa="vacancy-title"]') 
      || document.querySelector('h1');
    if (titleEl) text = titleEl.textContent + ' ' + text;
    return text.toLowerCase().trim();
  }

  extractSalary() {
    const salaryEl = document.querySelector('[data-qa="vacancy-salary"]')
      || document.querySelector('.vacancy-salary');
    if (!salaryEl) return null;
    const text = salaryEl.textContent.replace(/\s/g, '');
    const numbers = text.match(/\d+/g);
    if (!numbers) return null;
    return {
      min: parseInt(numbers[0]) || null,
      max: parseInt(numbers[1]) || parseInt(numbers[0]) || null
    };
  }

  extractExperience() {
    const expEl = document.querySelector('[data-qa="vacancy-experience"]')
      || document.querySelector('.vacancy-experience');
    if (!expEl) return null;
    const text = expEl.textContent.toLowerCase();
    const match = text.match(/(\d+).*?(\d+)?/);
    if (match) {
      return {
        min: parseInt(match[1]) || 0,
        max: parseInt(match[2]) || parseInt(match[1]) || 0
      };
    }
    return null;
  }

  // Новый метод: детальный анализ с объяснением
  analyzeDetailed(text, salary, experience) {
    const details = {
      title: { grade: null, score: 0, matches: [] },
      description: { grade: null, score: 0, matches: [] },
      salary: { grade: null, score: 0, info: '' },
      experience: { grade: null, score: 0, info: '' },
      context: { grade: null, score: 0, matches: [] },
      skills: { grade: null, score: 0, matches: [] }
    };

    // Анализ заголовка
    const titleText = (document.querySelector('[data-qa="vacancy-title"]') 
      || document.querySelector('h1') || {}).textContent || '';
    const titleLower = titleText.toLowerCase();
    
    for (const [grade, titles] of Object.entries(this.titleDB)) {
      for (const title of titles) {
        if (titleLower.includes(title.toLowerCase())) {
          details.title.matches.push(title);
          details.title.score += 15;
          details.title.grade = grade;
          break;
        }
      }
    }
    if (!details.title.grade) {
      // Проверяем keywords в заголовке
      for (const [grade, patterns] of Object.entries(this.patterns)) {
        for (const pattern of patterns.title_patterns) {
          if (titleLower.includes(pattern.toLowerCase())) {
            details.title.matches.push(pattern);
            details.title.score += 12;
            details.title.grade = grade;
            break;
          }
        }
        if (details.title.grade) break;
      }
    }

    // Анализ описания (keywords + context phrases)
    for (const [grade, patterns] of Object.entries(this.patterns)) {
      for (const keyword of patterns.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          details.description.matches.push(keyword);
          details.description.score += 5;
          details.description.grade = grade;
        }
      }
    }

    // Контекстные фразы
    for (const [grade, phrases] of Object.entries(this.contextPhrases)) {
      for (const phrase of phrases) {
        if (text.includes(phrase.toLowerCase())) {
          details.context.matches.push(phrase);
          details.context.score += 6;
          details.context.grade = grade;
        }
      }
    }

    // Навыки
    for (const [grade, skills] of Object.entries(this.skillsDB)) {
      for (const skill of skills) {
        if (text.includes(skill.toLowerCase())) {
          details.skills.matches.push(skill);
          details.skills.score += 3;
          details.skills.grade = grade;
        }
      }
    }

    // Зарплата
    if (salary && salary.max) {
      let bestMatch = { grade: null, diff: Infinity };
      for (const [grade, patterns] of Object.entries(this.patterns)) {
        if (patterns.salary_max) {
          const diff = Math.abs(salary.max - patterns.salary_max);
          if (diff < bestMatch.diff) {
            bestMatch = { grade, diff };
          }
        }
      }
      if (bestMatch.grade) {
        details.salary.grade = bestMatch.grade;
        details.salary.score = 8;
        const market = this.patterns[bestMatch.grade];
        details.salary.info = `ЗП ${salary.max}₽ (рынок ${bestMatch.grade}: ${market.salary_min || '?'}-${market.salary_max}₽)`;
      }
    } else {
      details.salary.info = 'ЗП не указана';
    }

    // Опыт
    if (experience) {
      let bestMatch = { grade: null, diff: Infinity };
      for (const [grade, patterns] of Object.entries(this.patterns)) {
        if (patterns.experience_max !== undefined) {
          const diff = Math.abs(experience.max - patterns.experience_max);
          if (diff < bestMatch.diff) {
            bestMatch = { grade, diff };
          }
        }
      }
      if (bestMatch.grade) {
        details.experience.grade = bestMatch.grade;
        details.experience.score = 6;
        const market = this.patterns[bestMatch.grade];
        details.experience.info = `Опыт ${experience.max} лет (рынок ${bestMatch.grade}: ${market.experience_min || 0}-${market.experience_max} лет)`;
      }
    } else {
      details.experience.info = 'Опыт не указан';
    }

    return details;
  }

  // Генерируем читаемое объяснение
  generateExplanation(details, finalGrade) {
    const parts = [];
    
    if (details.title.grade && details.title.matches.length > 0) {
      parts.push(`Заголовок: ${this.translateGrade(details.title.grade)} (${details.title.matches[0]})`);
    } else {
      parts.push('Заголовок: не определён');
    }

    const descGrades = {};
    for (const match of details.description.matches) {
      const g = details.description.grade || '?';
      descGrades[g] = (descGrades[g] || 0) + 1;
    }
    const topDesc = Object.entries(descGrades).sort((a,b) => b[1]-a[1])[0];
    if (topDesc) {
      parts.push(`Описание: ${this.translateGrade(topDesc[0])} (${topDesc[1]} совпадений)`);
    }

    for (const match of details.context.matches.slice(0, 2)) {
      parts.push(`Контекст: "${match}"`);
    }

    if (details.salary.info) {
      parts.push(details.salary.info);
    }

    if (details.experience.info) {
      parts.push(details.experience.info);
    }

    return parts.join(' · ');
  }

  scoreGrade(text, salary, experience) {
    const scores = { "intern": 0, "junior": 0, "middle": 0, "senior": 0, "lead": 0 };

    for (const [grade, titles] of Object.entries(this.titleDB)) {
      for (const title of titles) {
        if (text.includes(title.toLowerCase())) {
          scores[grade] += 15;
          break;
        }
      }
    }

    for (const [grade, patterns] of Object.entries(this.patterns)) {
      for (const keyword of patterns.keywords) {
        if (text.includes(keyword.toLowerCase())) scores[grade] += 5;
      }
      for (const pattern of patterns.title_patterns) {
        if (text.includes(pattern.toLowerCase())) scores[grade] += 8;
      }
    }

    for (const [grade, phrases] of Object.entries(this.contextPhrases)) {
      for (const phrase of phrases) {
        if (text.includes(phrase.toLowerCase())) scores[grade] += 6;
      }
    }

    for (const [grade, skills] of Object.entries(this.skillsDB)) {
      for (const skill of skills) {
        if (text.includes(skill.toLowerCase())) scores[grade] += 3;
      }
    }

    if (salary && salary.max) {
      for (const [grade, patterns] of Object.entries(this.patterns)) {
        if (patterns.salary_max && salary.max <= patterns.salary_max) scores[grade] += 4;
        if (patterns.salary_min && salary.max >= patterns.salary_min) scores[grade] += 2;
      }
    }

    if (experience) {
      for (const [grade, patterns] of Object.entries(this.patterns)) {
        if (patterns.experience_max && experience.max <= patterns.experience_max) scores[grade] += 4;
        if (patterns.experience_min && experience.min >= patterns.experience_min) scores[grade] += 3;
      }
    }

    return scores;
  }

  classify() {
    const text = this.extractVacancyText();
    const salary = this.extractSalary();
    const experience = this.extractExperience();
    
    const scores = this.scoreGrade(text, salary, experience);
    const details = this.analyzeDetailed(text, salary, experience);
    
    let maxGrade = "junior";
    let maxScore = 0;
    let totalScore = 0;
    
    for (const [grade, score] of Object.entries(scores)) {
      totalScore += score;
      if (score > maxScore) {
        maxScore = score;
        maxGrade = grade;
      }
    }

    const confidence = totalScore > 0 
      ? Math.min(100, Math.round((maxScore / totalScore) * 100))
      : 50;

    let subLevel = '';
    const secondBest = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[1];
    
    if (secondBest && secondBest[1] > maxScore * 0.7) {
      subLevel = ` (ближе к ${this.translateGrade(secondBest[0])})`;
    }

    const explanation = this.generateExplanation(details, maxGrade);

    return {
      grade: maxGrade,
      confidence: confidence,
      subLevel: subLevel,
      explanation: explanation,
      scores: scores,
      salary: salary,
      experience: experience,
      textLength: text.length
    };
  }

  translateGrade(grade) {
    const translations = {
      "intern": "Intern/Стажер",
      "junior": "Junior",
      "middle": "Middle",
      "senior": "Senior",
      "lead": "Lead/Team Lead"
    };
    return translations[grade] || grade;
  }
}

window.GradeClassifier = GradeClassifier;
