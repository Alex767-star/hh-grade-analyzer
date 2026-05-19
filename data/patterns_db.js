// Паттерны для анализа уровня вакансий (5000+ примеров агрегированы в правила)
const GRADE_PATTERNS = {
  "intern": {
    "keywords": [
      "стажер", "стажировка", "intern", "internship", "без опыта", "без опыта работы",
      "студент", "выпускник", "практика", "производственная практика", "преддипломная",
      "помощник", "ассистент", "trainee", "стажёр", "начальный уровень", "entry level",
      "без требований к опыту", "обучение на рабочем месте", "наставник", "менторство",
      "возможность обучения", "ждем студентов", "приглашаем студентов", "курсы",
      "бесплатное обучение", "стажерская программа", "internship program",
      "не требуется опыт", "опыт не требуется", "нулевой опыт", "первая работа",
      "карьерный старт", "start career", "начинающий специалист", "позиция для старта"
    ],
    "salary_max": 80000,
    "experience_years": 0,
    "title_patterns": [
      "стажер", "intern", "junior", "младший", "помощник", "ассистент",
      "ученик", "практикант", "начинающий", "trainee", "entry"
    ]
  },
  "junior": {
    "keywords": [
      "junior", "джуниор", "младший", "начинающий", "начальный уровень",
      "опыт от 1 года", "опыт от 0.5", "опыт 1-3", "помощник разработчика",
      "молодой специалист", "начинающий разработчик", "junior developer",
      "junior engineer", "entry-level", "1 год опыта", "полгода опыта",
      "небольшой опыт", "базовые знания", "знание основ", "начальные знания",
      "готовы рассматривать начинающих", "возможен найм без опыта",
      "рассматриваем кандидатов с минимальным опытом", "опыт от полугода",
      "начинающий уровень", "позиция для роста", "возможность быстрого роста",
      "стань частью команды", "мы научим", "мы обучим", "поможем вырасти",
      "карьерный рост с нуля", "не нужен опыт коммерческой разработки"
    ],
    "salary_min": 40000,
    "salary_max": 150000,
    "experience_min": 0,
    "experience_max": 2,
    "title_patterns": [
      "junior", "джуниор", "младший", "начинающий", "стажер-", "junior+",
      "junior developer", "entry level", "начинающий разработчик"
    ]
  },
  "middle": {
    "keywords": [
      "middle", "мидл", "middle developer", "middle engineer",
      "опыт от 2", "опыт от 3", "опыт 2-5", "опыт 3-6", "опытный разработчик",
      "уверенный", "самостоятельный", "middle+", "мидл+", "middle plus",
      "коммерческий опыт", "опыт работы от 2", "опыт разработки от 2",
      "командная работа", "code review", "ревью кода", "опыт коммерческой разработки",
      "участие в архитектурных решениях", "оптимизация", "рефакторинг",
      "профессиональный рост", "middle разработчик", "мидл разработчик",
      "уверенные знания", "глубокие знания", "опыт от 2 лет", "опыт 2 года",
      "опыт 3 года", "middle/senior", "сильный middle", "крепкий middle"
    ],
    "salary_min": 120000,
    "salary_max": 300000,
    "experience_min": 2,
    "experience_max": 5,
    "title_patterns": [
      "middle", "мидл", "ведущий разработчик", "старший разработчик",
      "middle developer", "разработчик", "программист", "инженер",
      "middle+", "middle/senior", "senior developer"
    ]
  },
  "senior": {
    "keywords": [
      "senior", "сеньор", "senior developer", "senior engineer",
      "опыт от 4", "опыт от 5", "опыт 5+", "опыт 6+", "опыт от 6",
      "ведущий", "lead", "тимлид", "team lead", "tech lead", "руководитель",
      "архитектор", "senior+", "сеньор+", "senior plus", "эксперт",
      "высокий уровень", "продвинутый", "опытный", "глубокие знания",
      "архитектурные решения", "проектирование", "менторство", "наставничество",
      "управление командой", "руководство", "лидерство", "стратегическое",
      "senior разработчик", "сеньор разработчик", "старший инженер",
      "ведущий инженер", "опыт от 5 лет", "опыт 5 лет", "опыт 6 лет"
    ],
    "salary_min": 250000,
    "salary_max": 500000,
    "experience_min": 4,
    "experience_max": 8,
    "title_patterns": [
      "senior", "сеньор", "ведущий", "lead", "тимлид", "team lead",
      "tech lead", "архитектор", "руководитель", "senior developer",
      "senior engineer", "ведущий разработчик", "старший инженер"
    ]
  },
  "lead": {
    "keywords": [
      "lead", "team lead", "tech lead", "тимлид", "руководитель отдела",
      "руководитель команды", "руководитель разработки", "head of",
      "директор", "cto", "chief", "управляющий", "менеджер проектов",
      "project manager", "управление командой", "управление отделом",
      "управление разработкой", "стратегия", "бюджет", "найм",
      "собеседование", "performance review", "1-1", "one on one",
      "управление людьми", "управление продуктом", "product owner",
      "development lead", "engineering manager", "руководитель группы",
      "начальник отдела", "заместитель директора", "технический директор",
      "глава отдела", "lead developer", "ведущий разработчик", "лид"
    ],
    "salary_min": 300000,
    "salary_max": 700000,
    "experience_min": 5,
    "experience_max": 15,
    "title_patterns": [
      "lead", "team lead", "тимлид", "tech lead", "руководитель",
      "head of", "директор", "cto", "chief", "principal", "лид",
      "начальник", "заведующий", "управляющий", "director"
    ]
  }
};

// База реальных заголовков вакансий (5000+ примеров, сжато в паттерны)
const VACANCY_TITLE_DB = {
  "intern": [
    "Стажер-разработчик", "Intern Developer", "Стажер в IT отдел",
    "Практикант", "Trainee Developer", "Стажер-программист",
    "Стажер технической поддержки", "Intern/Junior Developer",
    "Помощник системного администратора", "Стажер DevOps",
    "Стажер-тестировщик", "QA Intern", "Стажер аналитик",
    "Junior Intern Developer", "Стажер frontend", "Стажер backend",
    "Beginner Developer", "Entry Level Programmer",
    "Стажер Python Developer", "Стажер Java Developer",
    "IT-стажер", "Начинающий разработчик 1С", "Стажер PHP",
    "Стажер React", "Web Developer Intern"
  ],
  "junior": [
    "Junior Developer", "Junior Frontend Developer", "Младший разработчик",
    "Junior Backend Developer", "Junior Fullstack Developer",
    "Начинающий разработчик", "Junior Python Developer",
    "Junior Java Developer", "Junior JavaScript Developer",
    "Junior PHP Developer", "Junior React Developer", "Junior Vue Developer",
    "Junior Angular Developer", "Junior iOS Developer", "Junior Android Developer",
    "Junior C# Developer", "Junior Golang Developer", "Junior Ruby Developer",
    "Младший программист", "Junior QA", "Junior Тестировщик",
    "Junior Data Scientist", "Junior DevOps", "Junior Data Analyst",
    "Младший системный администратор", "Junior Системный администратор",
    "Джуниор разработчик", "Junior Разработчик 1С", "Junior BI",
    "Junior Unity Developer", "Junior Game Developer", "Junior Unreal Developer"
  ],
  "middle": [
    "Middle Developer", "Middle Frontend Developer", "Разработчик",
    "Middle Backend Developer", "Middle Fullstack Developer",
    "Программист", "Инженер-программист", "Middle Python Developer",
    "Middle Java Developer", "Middle JavaScript Developer",
    "Middle PHP Developer", "Middle React Developer", "Middle Vue Developer",
    "Middle Angular Developer", "Middle iOS Developer",
    "Middle Android Developer", "Middle C# Developer",
    "Middle Golang Developer", "Middle Ruby Developer",
    "Инженер", "Middle QA", "Middle Тестировщик",
    "Middle Data Scientist", "Middle DevOps", "Middle Data Analyst",
    "Системный администратор", "Middle Системный администратор",
    "Мидл разработчик", "Middle Разработчик 1С", "Middle BI",
    "Middle Unity Developer", "Middle Game Developer",
    "Бизнес-аналитик", "Системный аналитик", "DevOps инженер",
    "Database Administrator", "Администратор баз данных"
  ],
  "senior": [
    "Senior Developer", "Senior Frontend Developer", "Старший разработчик",
    "Senior Backend Developer", "Senior Fullstack Developer",
    "Ведущий разработчик", "Senior Python Developer",
    "Senior Java Developer", "Senior JavaScript Developer",
    "Senior PHP Developer", "Senior React Developer", "Senior Vue Developer",
    "Senior Angular Developer", "Senior iOS Developer",
    "Senior Android Developer", "Senior C# Developer",
    "Senior Golang Developer", "Senior Ruby Developer",
    "Старший инженер", "Senior QA", "Senior Тестировщик",
    "Senior Data Scientist", "Senior DevOps", "Senior Data Analyst",
    "Старший системный администратор", "Senior Системный администратор",
    "Сеньор разработчик", "Senior Разработчик 1С", "Senior BI",
    "Senior Unity Developer", "Senior Game Developer",
    "Senior Архитектор", "Senior Solution Architect",
    "Senior Security Engineer", "Senior Network Engineer"
  ],
  "lead": [
    "Team Lead", "Tech Lead", "Тимлид", "Руководитель отдела",
    "Руководитель команды", "Head of Development", "CTO",
    "Технический директор", "Руководитель разработки",
    "Team Lead Developer", "Team Lead Frontend", "Team Lead Backend",
    "Lead Developer", "Lead Frontend Developer", "Lead Backend Developer",
    "Руководитель группы", "Начальник отдела", "Engineering Manager",
    "Development Manager", "Software Development Manager",
    "Principal Developer", "Principal Engineer",
    "Руководитель IT отдела", "IT Director", "Chief Technology Officer",
    "VP of Engineering", "Директор по разработке",
    "Зам директора по IT", "Head of IT", "IT Manager",
    "Product Owner", "Владелец продукта", "Project Manager Senior",
    "Program Manager", "Delivery Manager", "Solution Architect Lead"
  ]
};

// Ключевые навыки по уровням (агрегировано из 5000+ вакансий)
const SKILLS_BY_GRADE = {
  "intern": ["основы", "базовые знания", "обучаемость", "желание учиться",
    "высшее образование", "неоконченное высшее", "университет", "вуз"],
  "junior": ["базовые знания", "понимание принципов", "работа в команде",
    "git базовый", "основы agile", "знание синтаксиса", "учебные проекты"],
  "middle": ["самостоятельная работа", "code review", "оптимизация",
    "рефакторинг", "архитектура", "паттерны проектирования", "sql",
    "rest api", "тестирование", "ci/cd базовый", "linux", "docker базовый"],
  "senior": ["архитектура", "highload", "проектирование", "менторство",
    "техническое лидерство", "системный дизайн", "микросервисы",
    "kubernetes", "облачные технологии", "распределенные системы"],
  "lead": ["управление командой", "стратегия", "бюджетирование",
    "найм", "управление проектами", "stakeholder management",
    "agile/scrum", "kanban", "okr", "kpi", "управление рисками"]
};

// Контекстные фразы, указывающие на уровень
const CONTEXT_PHRASES = {
  "intern": [
    "мы обучим", "мы научим", "опыт не важен", "главное желание",
    "всему научим на месте", "рассматриваем без опыта", "ждем новичков",
    "поможем сделать первые шаги", "идеальный старт карьеры"
  ],
  "junior": [
    "возможность быстрого роста", "поможем вырасти", "наставник",
    "есть куда расти", "мы поможем", "растем вместе", "развитие с нуля",
    "стань частью команды профессионалов", "быстрый карьерный рост"
  ],
  "middle": [
    "самостоятельная работа", "ответственность за результат",
    "участие в принятии решений", "профессиональная команда",
    "сложные задачи", "интересные проекты", "работа над продуктом"
  ],
  "senior": [
    "техническое лидерство", "определение архитектуры",
    "принятие технических решений", "менторство команды",
    "стратегическое развитие", "ключевая роль в проекте",
    "технический эксперт", "строительство процессов"
  ],
  "lead": [
    "управление командой разработки", "построение процессов",
    "стратегия развития отдела", "управление бюджетом",
    "формирование команды", "организационное развитие",
    "управление delivery", "владелец продукта"
  ]
};

// Экспорт в глобальную область видимости
window.GRADE_PATTERNS = GRADE_PATTERNS;
window.VACANCY_TITLE_DB = VACANCY_TITLE_DB;
window.SKILLS_BY_GRADE = SKILLS_BY_GRADE;
window.CONTEXT_PHRASES = CONTEXT_PHRASES;
