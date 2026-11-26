
import { useState } from 'react';
import {
  Activity, ArrowRight, Dumbbell, Flame,
  HeartPulse, Menu, Sparkles, Target,
  Globe, ChevronDown, Check, Clock3
} from 'lucide-react';

type Language = 'RU' | 'UK' | 'EN';

const translations = {
  RU: {
    nav: ['Возможности', 'Тренировки', 'Питание'],
    eyebrow: 'ТВОЯ СИЛА. ТВОЙ ТЕМП.',
    title: 'Стань',
    accent: 'сильнее.',
    desc: 'Тренируйся дома. Питайся осознанно. Отслеживай прогресс. Создай версию себя, которой будешь гордиться.',
    start: 'Подобрать тренировку',
    features: 'БОЛЬШЕ, ЧЕМ ТРЕНИРОВКИ',
    featureTitle: 'Новая привычка жить сильнее.',
    cards: ['Тренировки', 'Питание', 'Твой прогресс'],
    cardDesc: [
      'Персональные планы под твои цели и уровень.',
      'Баланс калорий и понятный подход к питанию.',
      'Следи за активностью и своими достижениями.'
    ],
    goals: 'ТВОЯ ЦЕЛЬ',
    goalTitle: 'Твоё тело. Твои правила.',
    goalNames: ['Снижение веса', 'Набор мышц', 'Общая форма', 'Выносливость', 'Гибкость', 'Здоровье'],
    workoutLabel: 'ПОД ТВОЮ ЦЕЛЬ',
    workoutTitle: 'Выбери свою тренировку.',
    workoutDescription: 'Домашние занятия без тренажёров и специального оборудования.',
    duration: 'минут',
    levels: ['Начальный', 'Средний', 'Продвинутый'],
    choose: 'Выбрать тренировку',
    chosen: 'Тренировка выбрана',
    selectedMessage: 'Отличный выбор! Эта тренировка добавлена в твой текущий выбор.',
    nutrition: 'ПИТАНИЕ',
    nutritionTitle: 'Начни с понимания своего тела.',
    age: 'Возраст',
    weight: 'Вес, кг',
    height: 'Рост, см',
    calculate: 'Рассчитать',
    result: 'Примерная норма калорий',
    cta: 'Сделай первый шаг.',
    ctaDesc: 'Не нужно быть идеальным. Нужно просто начать.',
    footer: 'Сила строится день за днём.'
  },
  UK: {
    nav: ['Можливості', 'Тренування', 'Харчування'],
    eyebrow: 'ТВОЯ СИЛА. ТВІЙ ТЕМП.',
    title: 'Стань',
    accent: 'сильнішим.',
    desc: 'Тренуйся вдома. Харчуйся усвідомлено. Відстежуй прогрес. Створи версію себе, якою пишатимешся.',
    start: 'Обрати тренування',
    features: 'БІЛЬШЕ, НІЖ ТРЕНУВАННЯ',
    featureTitle: 'Нова звичка жити сильніше.',
    cards: ['Тренування', 'Харчування', 'Твій прогрес'],
    cardDesc: [
      'Персональні плани відповідно до твоїх цілей.',
      'Баланс калорій і зрозумілий підхід до харчування.',
      'Стеж за активністю та власними досягненнями.'
    ],
    goals: 'ТВОЯ МЕТА',
    goalTitle: 'Твоє тіло. Твої правила.',
    goalNames: ['Схуднення', 'Набір м’язів', 'Загальна форма', 'Витривалість', 'Гнучкість', 'Здоров’я'],
    workoutLabel: 'ДЛЯ ТВОЄЇ МЕТИ',
    workoutTitle: 'Обери своє тренування.',
    workoutDescription: 'Домашні заняття без тренажерів і спеціального обладнання.',
    duration: 'хвилин',
    levels: ['Початковий', 'Середній', 'Просунутий'],
    choose: 'Обрати тренування',
    chosen: 'Тренування обрано',
    selectedMessage: 'Чудовий вибір! Це тренування додано до твого поточного вибору.',
    nutrition: 'ХАРЧУВАННЯ',
    nutritionTitle: 'Почни з розуміння свого тіла.',
    age: 'Вік',
    weight: 'Вага, кг',
    height: 'Зріст, см',
    calculate: 'Розрахувати',
    result: 'Приблизна норма калорій',
    cta: 'Зроби перший крок.',
    ctaDesc: 'Не потрібно бути ідеальним. Потрібно просто почати.',
    footer: 'Сила будується день за днем.'
  },
  EN: {
    nav: ['Features', 'Workouts', 'Nutrition'],
    eyebrow: 'YOUR STRENGTH. YOUR PACE.',
    title: 'Become',
    accent: 'stronger.',
    desc: 'Train at home. Eat with intention. Track your progress. Build a version of yourself you are proud of.',
    start: 'Find your workout',
    features: 'MORE THAN WORKOUTS',
    featureTitle: 'A stronger way of living.',
    cards: ['Training', 'Nutrition', 'Your progress'],
    cardDesc: [
      'Personal plans built around your goals.',
      'Calorie balance and a simple approach to nutrition.',
      'Track your activity and achievements.'
    ],
    goals: 'YOUR GOAL',
    goalTitle: 'Your body. Your rules.',
    goalNames: ['Weight loss', 'Build muscle', 'Get fit', 'Endurance', 'Flexibility', 'Wellness'],
    workoutLabel: 'BUILT FOR YOUR GOAL',
    workoutTitle: 'Choose your workout.',
    workoutDescription: 'Home workouts without machines or special equipment.',
    duration: 'minutes',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    choose: 'Choose workout',
    chosen: 'Workout selected',
    selectedMessage: 'Great choice! This workout has been added to your current selection.',
    nutrition: 'NUTRITION',
    nutritionTitle: 'Understand your body.',
    age: 'Age',
    weight: 'Weight, kg',
    height: 'Height, cm',
    calculate: 'Calculate',
    result: 'Estimated calorie target',
    cta: 'Make the first move.',
    ctaDesc: 'You do not need to be perfect. You just need to begin.',
    footer: 'Strength is built one day at a time.'
  }
};

const icons = [Dumbbell, Flame, Activity, Target, Sparkles, HeartPulse];

const workoutLibrary = [
  {
    goal: 0,
    title: ['Кардио без прыжков', 'Кардіо без стрибків', 'Low-impact cardio'],
    description: [
      'Активная тренировка для всего тела с умеренной нагрузкой.',
      'Активне тренування для всього тіла з помірним навантаженням.',
      'An active full-body session with moderate impact.'
    ],
    minutes: 20,
    level: 0,
    icon: Flame
  },
  {
    goal: 0,
    title: ['Интервальный фитнес', 'Інтервальний фітнес', 'Interval fitness'],
    description: [
      'Чередование активных упражнений и короткого отдыха.',
      'Чергування активних вправ і короткого відпочинку.',
      'Alternate active exercises with short recovery periods.'
    ],
    minutes: 25,
    level: 1,
    icon: Activity
  },
  {
    goal: 1,
    title: ['Сила собственного веса', 'Сила власної ваги', 'Bodyweight strength'],
    description: [
      'Базовые силовые упражнения для основных групп мышц.',
      'Базові силові вправи для основних груп м’язів.',
      'Fundamental strength exercises for major muscle groups.'
    ],
    minutes: 30,
    level: 1,
    icon: Dumbbell
  },
  {
    goal: 1,
    title: ['Сильный корпус', 'Сильний корпус', 'Core strength'],
    description: [
      'Упражнения для мышц живота, спины и стабилизации.',
      'Вправи для м’язів живота, спини та стабілізації.',
      'Exercises for your abs, back and core stability.'
    ],
    minutes: 18,
    level: 0,
    icon: Target
  },
  {
    goal: 2,
    title: ['Тренировка всего тела', 'Тренування всього тіла', 'Full body workout'],
    description: [
      'Комплекс упражнений для поддержания общей физической формы.',
      'Комплекс вправ для підтримки загальної фізичної форми.',
      'A balanced routine to maintain overall fitness.'
    ],
    minutes: 25,
    level: 0,
    icon: Activity
  },
  {
    goal: 2,
    title: ['Домашний фитнес', 'Домашній фітнес', 'Home fitness'],
    description: [
      'Разнообразные упражнения для ежедневной активности.',
      'Різноманітні вправи для щоденної активності.',
      'A varied routine to keep you moving every day.'
    ],
    minutes: 20,
    level: 0,
    icon: HeartPulse
  },
  {
    goal: 3,
    title: ['Интервальная выносливость', 'Інтервальна витривалість', 'Endurance intervals'],
    description: [
      'Постепенно развивай выносливость с чередованием нагрузки.',
      'Поступово розвивай витривалість із чергуванням навантаження.',
      'Build endurance with alternating work and recovery.'
    ],
    minutes: 25,
    level: 1,
    icon: Flame
  },
  {
    goal: 3,
    title: ['Энергия и темп', 'Енергія та темп', 'Energy and pace'],
    description: [
      'Динамичный комплекс для развития общей выносливости.',
      'Динамічний комплекс для розвитку загальної витривалості.',
      'A dynamic routine for improving overall stamina.'
    ],
    minutes: 22,
    level: 1,
    icon: Activity
  },
  {
    goal: 4,
    title: ['Мягкая растяжка', 'М’яке розтягування', 'Gentle stretching'],
    description: [
      'Спокойная растяжка основных групп мышц.',
      'Спокійне розтягування основних груп м’язів.',
      'A gentle stretch for your major muscle groups.'
    ],
    minutes: 15,
    level: 0,
    icon: HeartPulse
  },
  {
    goal: 4,
    title: ['Мобильность тела', 'Мобільність тіла', 'Full-body mobility'],
    description: [
      'Упражнения для подвижности суставов и контроля движений.',
      'Вправи для рухливості суглобів і контролю рухів.',
      'Exercises for joint mobility and movement control.'
    ],
    minutes: 20,
    level: 1,
    icon: Sparkles
  },
  {
    goal: 5,
    title: ['Зарядка для здоровья', 'Руханка для здоров’я', 'Healthy morning routine'],
    description: [
      'Лёгкий комплекс для мягкого начала активного дня.',
      'Легкий комплекс для м’якого початку активного дня.',
      'A gentle routine to start an active day.'
    ],
    minutes: 12,
    level: 0,
    icon: HeartPulse
  },
  {
    goal: 5,
    title: ['Движение каждый день', 'Рух щодня', 'Daily movement'],
    description: [
      'Несложные упражнения для регулярной физической активности.',
      'Нескладні вправи для регулярної фізичної активності.',
      'Simple exercises for regular daily activity.'
    ],
    minutes: 15,
    level: 0,
    icon: Activity
  }
];

export default function App() {
  const [lang, setLang] = useState<Language>('RU');
  const [goal, setGoal] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [calories, setCalories] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const t = translations[lang];
  const languageIndex = lang === 'RU' ? 0 : lang === 'UK' ? 1 : 2;
  const visibleWorkouts = workoutLibrary
    .map((workout, index) => ({ ...workout, id: index }))
    .filter(workout => workout.goal === goal);

  function calculate() {
    const a = Number(age);
    const w = Number(weight);
    const h = Number(height);

    if (a < 14 || a > 100 || w < 30 || w > 300 || h < 100 || h > 230) {
      setCalories(null);
      return;
    }

    setCalories(Math.round(10 * w + 6.25 * h - 5 * a + 5));
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenu(false);
  }

  function changeGoal(index: number) {
    setGoal(index);
    setSelectedWorkout(null);
  }

  return (
    <main>
      <header className="topbar">
        <a className="logo" href="#">VIGOR<span>.</span></a>

        <nav className={menu ? 'nav open' : 'nav'}>
          {t.nav.map((item, i) => (
            <button key={item} onClick={() => scrollTo(['features', 'workouts', 'nutrition'][i])}>
              {item}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language-picker">
            <button
              className={languageOpen ? 'language-trigger active' : 'language-trigger'}
              type="button"
              aria-label="Choose language"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <Globe size={16} />
              <span>{lang}</span>
              <ChevronDown
                className={languageOpen ? 'language-chevron rotated' : 'language-chevron'}
                size={14}
              />
            </button>

            {languageOpen && (
              <div className="language-panel">
                <span className="language-panel-label">LANGUAGE</span>
                {([
                  ['RU', 'Русский'],
                  ['UK', 'Українська'],
                  ['EN', 'English']
                ] as const).map(([code, name]) => (
                  <button
                    type="button"
                    key={code}
                    className={lang === code ? 'language-option selected' : 'language-option'}
                    onClick={() => {
                      setLang(code);
                      setLanguageOpen(false);
                    }}
                  >
                    <span className="language-code">{code}</span>
                    <span className="language-name">{name}</span>
                    {lang === code && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="mobile-menu" onClick={() => setMenu(!menu)}>
            <Menu />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-image" />
        <div className="hero-content">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}<br /><em>{t.accent}</em></h1>
          <p>{t.desc}</p>
          <button className="primary-button" onClick={() => scrollTo('workouts')}>
            {t.start}<ArrowRight size={18} />
          </button>
          <div className="hero-caption">VIGOR FITNESS PLATFORM · 2026</div>
        </div>
      </section>

      <section className="features section" id="features">
        <span className="eyebrow">{t.features}</span>
        <h2>{t.featureTitle}</h2>
        <div className="feature-grid">
          {t.cards.map((card, i) => {
            const Icon = [Dumbbell, HeartPulse, Activity][i];
            return (
              <article className="feature-card" key={card}>
                <Icon size={28} />
                <h3>{card}</h3>
                <p>{t.cardDesc[i]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="workouts section" id="workouts">
        <span className="eyebrow">{t.goals}</span>
        <h2>{t.goalTitle}</h2>

        <div className="goal-grid">
          {t.goalNames.map((name, i) => {
            const Icon = icons[i];
            return (
              <button
                key={name}
                className={goal === i ? 'goal-card active' : 'goal-card'}
                onClick={() => changeGoal(i)}
              >
                <Icon size={22} />
                <span>{name}</span>
                <ArrowRight size={16} />
              </button>
            );
          })}
        </div>

        <div className="workout-results">
          <span className="eyebrow">{t.workoutLabel}</span>
          <h3>{t.workoutTitle}</h3>
          <p className="workout-intro">{t.workoutDescription}</p>

          <div className="workout-grid">
            {visibleWorkouts.map(workout => {
              const Icon = workout.icon;
              const isSelected = selectedWorkout === workout.id;

              return (
                <article className={isSelected ? 'workout-card selected' : 'workout-card'} key={workout.id}>
                  <div className="workout-card-icon">
                    <Icon size={23} />
                  </div>
                  <h4>{workout.title[languageIndex]}</h4>
                  <p>{workout.description[languageIndex]}</p>

                  <div className="workout-meta">
                    <span><Clock3 size={14} /> {workout.minutes} {t.duration}</span>
                    <span>{t.levels[workout.level]}</span>
                  </div>

                  <button
                    className="workout-select"
                    onClick={() => setSelectedWorkout(isSelected ? null : workout.id)}
                  >
                    {isSelected ? t.chosen : t.choose}
                    {isSelected ? <Check size={16} /> : <ArrowRight size={16} />}
                  </button>
                </article>
              );
            })}
          </div>

          {selectedWorkout !== null && (
            <div className="workout-confirmation">
              <Check size={18} />
              <span>{t.selectedMessage}</span>
            </div>
          )}
        </div>
      </section>

      <section className="nutrition section" id="nutrition">
        <span className="eyebrow">{t.nutrition}</span>
        <h2>{t.nutritionTitle}</h2>
        <div className="calculator">
          <label>{t.age}
            <input type="number" value={age} onChange={e => setAge(e.target.value)} />
          </label>
          <label>{t.weight}
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
          </label>
          <label>{t.height}
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} />
          </label>
          <button className="primary-button" onClick={calculate}>
            {t.calculate}<ArrowRight size={18} />
          </button>
        </div>
        {calories !== null && (
          <div className="result">
            <span>{t.result}</span>
            <strong>{calories} kcal</strong>
            <small>Ориентировочная оценка по формуле Миффлина — Сан Жеора для мужчин.</small>
          </div>
        )}
      </section>

      <section className="cta">
        <Sparkles size={25} />
        <h2>{t.cta}</h2>
        <p>{t.ctaDesc}</p>
        <button className="primary-button" onClick={() => scrollTo('workouts')}>
          {t.start}<ArrowRight size={18} />
        </button>
      </section>

      <footer>
        <a className="logo" href="#">VIGOR<span>.</span></a>
        <p>{t.footer}</p>
        <small>© 2026 VIGOR</small>
      </footer>
    </main>
  );
}
