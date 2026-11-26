
import { useEffect, useState } from 'react';
import {
  Activity, ArrowRight, Dumbbell, Flame, HeartPulse, Menu,
  Sparkles, Target, Globe, ChevronDown, Check, Clock3,
  ArrowLeft, Play, Pause, Trophy
} from 'lucide-react';

type Language = 'RU' | 'UK' | 'EN';
type SessionMode = 'idle' | 'active' | 'rest' | 'paused' | 'completed';
type PausedFrom = 'active' | 'rest' | null;

type SavedSession = {
  version: 1;
  activeWorkout: number;
  sessionMode: SessionMode;
  pausedFrom: PausedFrom;
  exerciseIndex: number;
  setNumber: number;
  restSeconds: number;
  completedSets: number;
  sessionSeconds: number;
};

const SESSION_STORAGE_KEY = 'vigor-session-v1';

function loadSavedSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<SavedSession>;
    if (
      saved.version !== 1 ||
      !Number.isInteger(saved.activeWorkout) ||
      (saved.activeWorkout as number) < 0 ||
      (saved.activeWorkout as number) >= workoutLibrary.length ||
      !['idle', 'active', 'rest', 'paused', 'completed'].includes(String(saved.sessionMode)) ||
      !Number.isInteger(saved.exerciseIndex) ||
      !Number.isInteger(saved.setNumber) ||
      !Number.isFinite(saved.restSeconds) ||
      !Number.isFinite(saved.completedSets) ||
      !Number.isFinite(saved.sessionSeconds)
    ) return null;
    let sessionMode = saved.sessionMode as SessionMode;
    let pausedFrom = saved.pausedFrom ?? null;
    if (sessionMode === 'active' || sessionMode === 'rest') {
      pausedFrom = sessionMode;
      sessionMode = 'paused';
    }
    if (sessionMode === 'paused' && pausedFrom !== 'active' && pausedFrom !== 'rest') {
      sessionMode = 'active';
      pausedFrom = null;
    }
    return {
      version: 1,
      activeWorkout: saved.activeWorkout as number,
      sessionMode,
      pausedFrom,
      exerciseIndex: Math.max(0, saved.exerciseIndex as number),
      setNumber: Math.max(1, saved.setNumber as number),
      restSeconds: Math.max(0, Math.floor(saved.restSeconds as number)),
      completedSets: Math.max(0, Math.floor(saved.completedSets as number)),
      sessionSeconds: Math.max(0, Math.floor(saved.sessionSeconds as number))
    };
  } catch {
    return null;
  }
}

const translations = {
  RU: {
    nav: ['Возможности', 'Тренировки', 'Питание'],
    eyebrow: 'ТВОЯ СИЛА. ТВОЙ ТЕМП.',
    title: 'Стань', accent: 'сильнее.',
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
    choose: 'Подробнее',
    nutrition: 'ПИТАНИЕ',
    nutritionTitle: 'Начни с понимания своего тела.',
    age: 'Возраст', weight: 'Вес, кг', height: 'Рост, см',
    calculate: 'Рассчитать', result: 'Примерная норма калорий',
    cta: 'Сделай первый шаг.',
    ctaDesc: 'Не нужно быть идеальным. Нужно просто начать.',
    footer: 'Сила строится день за днём.',
    back: 'Назад к тренировкам',
    workoutPlan: 'ПЛАН ТРЕНИРОВКИ',
    exercises: 'Упражнения',
    sets: 'подхода',
    reps: 'повторений',
    technique: 'Техника выполнения',
    rest: 'Отдых',
    seconds: 'сек',
    startWorkout: 'Начать тренировку',
    pause: 'Пауза',
    resume: 'Продолжить',
    reset: 'Сбросить',
    finish: 'Завершить тренировку',
    completed: 'Тренировка завершена!',
    completedText: 'Отличная работа. Не забывай восстановиться и выпить воды.',
    safety: 'Выполняй упражнения в комфортном темпе. При боли или плохом самочувствии остановись.',
    warmup: 'Перед началом сделай лёгкую разминку в течение 3–5 минут.',
    currentExercise: 'ТЕКУЩЕЕ УПРАЖНЕНИЕ',
    set: 'Подход',
    of: 'из',
    done: 'Подход выполнен',
    next: 'Следующее упражнение',
    restMessage: 'Время восстановиться. Дыши спокойно.',
    skipRest: 'Пропустить отдых',
    progress: 'Прогресс тренировки',
    exercisesDone: 'Упражнений выполнено',
    setsDone: 'Подходов выполнено',
    totalTime: 'Плановое время',
    backToList: 'К списку упражнений',
    startAgain: 'Вернуться к каталогу',
    congratulations: 'Ты справился!',
    exercise: 'упражнение'
  },
  UK: {
    nav: ['Можливості', 'Тренування', 'Харчування'],
    eyebrow: 'ТВОЯ СИЛА. ТВІЙ ТЕМП.',
    title: 'Стань', accent: 'сильнішим.',
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
    choose: 'Детальніше',
    nutrition: 'ХАРЧУВАННЯ',
    nutritionTitle: 'Почни з розуміння свого тіла.',
    age: 'Вік', weight: 'Вага, кг', height: 'Зріст, см',
    calculate: 'Розрахувати', result: 'Приблизна норма калорій',
    cta: 'Зроби перший крок.',
    ctaDesc: 'Не потрібно бути ідеальним. Потрібно просто почати.',
    footer: 'Сила будується день за днем.',
    back: 'Назад до тренувань',
    workoutPlan: 'ПЛАН ТРЕНУВАННЯ',
    exercises: 'Вправи',
    sets: 'підходи',
    reps: 'повторень',
    technique: 'Техніка виконання',
    rest: 'Відпочинок',
    seconds: 'сек',
    startWorkout: 'Почати тренування',
    pause: 'Пауза',
    resume: 'Продовжити',
    reset: 'Скинути',
    finish: 'Завершити тренування',
    completed: 'Тренування завершено!',
    completedText: 'Чудова робота. Не забувай відновитися та випити води.',
    safety: 'Виконуй вправи у комфортному темпі. При болю або поганому самопочутті зупинись.',
    warmup: 'Перед початком зроби легку розминку протягом 3–5 хвилин.',
    currentExercise: 'ПОТОЧНА ВПРАВА',
    set: 'Підхід',
    of: 'з',
    done: 'Підхід виконано',
    next: 'Наступна вправа',
    restMessage: 'Час відновитися. Дихай спокійно.',
    skipRest: 'Пропустити відпочинок',
    progress: 'Прогрес тренування',
    exercisesDone: 'Вправ виконано',
    setsDone: 'Підходів виконано',
    totalTime: 'Плановий час',
    backToList: 'До списку вправ',
    startAgain: 'Повернутися до каталогу',
    congratulations: 'Ти впорався!',
    exercise: 'вправа'
  },
  EN: {
    nav: ['Features', 'Workouts', 'Nutrition'],
    eyebrow: 'YOUR STRENGTH. YOUR PACE.',
    title: 'Become', accent: 'stronger.',
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
    choose: 'View workout',
    nutrition: 'NUTRITION',
    nutritionTitle: 'Understand your body.',
    age: 'Age', weight: 'Weight, kg', height: 'Height, cm',
    calculate: 'Calculate', result: 'Estimated calorie target',
    cta: 'Make the first move.',
    ctaDesc: 'You do not need to be perfect. You just need to begin.',
    footer: 'Strength is built one day at a time.',
    back: 'Back to workouts',
    workoutPlan: 'WORKOUT PLAN',
    exercises: 'Exercises',
    sets: 'sets',
    reps: 'reps',
    technique: 'How to perform',
    rest: 'Rest',
    seconds: 'sec',
    startWorkout: 'Start workout',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    finish: 'Finish workout',
    completed: 'Workout completed!',
    completedText: 'Great work. Remember to recover and drink some water.',
    safety: 'Move at a comfortable pace. Stop if you feel pain or unwell.',
    warmup: 'Start with a light 3–5 minute warm-up.',
    currentExercise: 'CURRENT EXERCISE',
    set: 'Set',
    of: 'of',
    done: 'Set completed',
    next: 'Next exercise',
    restMessage: 'Time to recover. Breathe calmly.',
    skipRest: 'Skip rest',
    progress: 'Workout progress',
    exercisesDone: 'Exercises completed',
    setsDone: 'Sets completed',
    totalTime: 'Planned time',
    backToList: 'Back to exercise list',
    startAgain: 'Return to catalog',
    congratulations: 'You did it!',
    exercise: 'exercise'
  }
};

const icons = [Dumbbell, Flame, Activity, Target, Sparkles, HeartPulse];

const workoutLibrary = [
  { goal: 0, title: ['Кардио без прыжков', 'Кардіо без стрибків', 'Low-impact cardio'], description: ['Активная тренировка для всего тела с умеренной нагрузкой.', 'Активне тренування для всього тіла з помірним навантаженням.', 'An active full-body session with moderate impact.'], minutes: 20, level: 0, icon: Flame },
  { goal: 0, title: ['Интервальный фитнес', 'Інтервальний фітнес', 'Interval fitness'], description: ['Чередование активных упражнений и короткого отдыха.', 'Чергування активних вправ і короткого відпочинку.', 'Alternate active exercises with short recovery periods.'], minutes: 25, level: 1, icon: Activity },
  { goal: 1, title: ['Сила собственного веса', 'Сила власної ваги', 'Bodyweight strength'], description: ['Базовые силовые упражнения для основных групп мышц.', 'Базові силові вправи для основних груп м’язів.', 'Fundamental strength exercises for major muscle groups.'], minutes: 30, level: 1, icon: Dumbbell },
  { goal: 1, title: ['Сильный корпус', 'Сильний корпус', 'Core strength'], description: ['Упражнения для мышц живота, спины и стабилизации.', 'Вправи для м’язів живота, спини та стабілізації.', 'Exercises for your abs, back and core stability.'], minutes: 18, level: 0, icon: Target },
  { goal: 2, title: ['Тренировка всего тела', 'Тренування всього тіла', 'Full body workout'], description: ['Комплекс упражнений для поддержания общей физической формы.', 'Комплекс вправ для підтримки загальної фізичної форми.', 'A balanced routine to maintain overall fitness.'], minutes: 25, level: 0, icon: Activity },
  { goal: 2, title: ['Домашний фитнес', 'Домашній фітнес', 'Home fitness'], description: ['Разнообразные упражнения для ежедневной активности.', 'Різноманітні вправи для щоденної активності.', 'A varied routine to keep you moving every day.'], minutes: 20, level: 0, icon: HeartPulse },
  { goal: 3, title: ['Интервальная выносливость', 'Інтервальна витривалість', 'Endurance intervals'], description: ['Постепенно развивай выносливость с чередованием нагрузки.', 'Поступово розвивай витривалість із чергуванням навантаження.', 'Build endurance with alternating work and recovery.'], minutes: 25, level: 1, icon: Flame },
  { goal: 3, title: ['Энергия и темп', 'Енергія та темп', 'Energy and pace'], description: ['Динамичный комплекс для развития общей выносливости.', 'Динамічний комплекс для розвитку загальної витривалості.', 'A dynamic routine for improving overall stamina.'], minutes: 22, level: 1, icon: Activity },
  { goal: 4, title: ['Мягкая растяжка', 'М’яке розтягування', 'Gentle stretching'], description: ['Спокойная растяжка основных групп мышц.', 'Спокійне розтягування основних груп м’язів.', 'A gentle stretch for your major muscle groups.'], minutes: 15, level: 0, icon: HeartPulse },
  { goal: 4, title: ['Мобильность тела', 'Мобільність тіла', 'Full-body mobility'], description: ['Упражнения для подвижности суставов и контроля движений.', 'Вправи для рухливості суглобів і контролю рухів.', 'Exercises for joint mobility and movement control.'], minutes: 20, level: 1, icon: Sparkles },
  { goal: 5, title: ['Зарядка для здоровья', 'Руханка для здоров’я', 'Healthy morning routine'], description: ['Лёгкий комплекс для мягкого начала активного дня.', 'Легкий комплекс для м’якого початку активного дня.', 'A gentle routine to start an active day.'], minutes: 12, level: 0, icon: HeartPulse },
  { goal: 5, title: ['Движение каждый день', 'Рух щодня', 'Daily movement'], description: ['Несложные упражнения для регулярной физической активности.', 'Нескладні вправи для регулярної фізичної активності.', 'Simple exercises for regular daily activity.'], minutes: 15, level: 0, icon: Activity }
];

const exercisePlans = [
  [
    [['Шаги на месте', '2', '40', 'Держи корпус прямо, двигай руками в ритме шага.'], ['Приседания до комфортной глубины', '2', '12', 'Отводи таз назад, колени направляй по линии носков.'], ['Отведение ноги назад стоя', '2', '12 на каждую', 'Держись за опору, не прогибай поясницу.'], ['Подъём коленей стоя', '2', '30 сек', 'Поднимай колени поочерёдно, сохраняй ровное дыхание.']],
    [['Кроки на місці', '2', '40', 'Тримай корпус прямо, рухай руками в ритмі кроку.'], ['Присідання до комфортної глибини', '2', '12', 'Відводь таз назад, коліна спрямовуй по лінії носків.'], ['Відведення ноги назад стоячи', '2', '12 на кожну', 'Тримайся за опору, не прогинай поперек.'], ['Піднімання колін стоячи', '2', '30 сек', 'Піднімай коліна почергово, зберігай рівне дихання.']],
    [['March in place', '2', '40', 'Keep your torso upright and move your arms with each step.'], ['Comfortable squats', '2', '12', 'Move your hips back and keep knees aligned with your toes.'], ['Standing leg extensions', '2', '12 each', 'Hold a support and avoid arching your lower back.'], ['Standing knee raises', '2', '30 sec', 'Raise your knees alternately and breathe steadily.']]
  ],
  [
    [['Шаги с ускорением', '3', '30 сек', 'Ускоряй шаг постепенно, не теряя контроля движений.'], ['Приседания', '3', '12', 'Опускайся плавно и не округляй спину.'], ['Шаги в сторону', '3', '30 сек', 'Слегка согни колени и делай контролируемые шаги.'], ['Подъём коленей', '3', '30 сек', 'Работай в комфортном темпе без резких движений.']],
    [['Кроки з прискоренням', '3', '30 сек', 'Поступово прискорюй крок, контролюй рухи.'], ['Присідання', '3', '12', 'Опускайся плавно та не округлюй спину.'], ['Кроки вбік', '3', '30 сек', 'Злегка зігни коліна та роби контрольовані кроки.'], ['Піднімання колін', '3', '30 сек', 'Працюй у комфортному темпі без різких рухів.']],
    [['Fast marching', '3', '30 sec', 'Increase your pace gradually while staying in control.'], ['Squats', '3', '12', 'Lower smoothly and keep your back neutral.'], ['Side steps', '3', '30 sec', 'Keep knees soft and take controlled steps.'], ['Knee raises', '3', '30 sec', 'Work at a comfortable pace without sudden movements.']]
  ],
  [
    [['Приседания', '3', '10', 'Держи спину нейтрально, колени направляй по линии стоп.'], ['Отжимания от стены', '3', '10', 'Держи тело прямой линией и сгибай локти под контролем.'], ['Ягодичный мост', '3', '12', 'Поднимай таз за счёт ягодиц, не переразгибай поясницу.'], ['Планка с колен', '2', '20 сек', 'Сохраняй ровную линию от головы до колен.']],
    [['Присідання', '3', '10', 'Тримай спину нейтрально, коліна спрямовуй по лінії стоп.'], ['Віджимання від стіни', '3', '10', 'Тримай тіло прямою лінією та згинай лікті контрольовано.'], ['Сідничний місток', '3', '12', 'Підіймай таз за рахунок сідниць, не перенапружуй поперек.'], ['Планка з колін', '2', '20 сек', 'Зберігай рівну лінію від голови до колін.']],
    [['Squats', '3', '10', 'Keep a neutral spine and align knees with your feet.'], ['Wall push-ups', '3', '10', 'Keep your body straight and bend your elbows with control.'], ['Glute bridge', '3', '12', 'Lift through your glutes without over-arching your back.'], ['Knee plank', '2', '20 sec', 'Keep a straight line from your head to your knees.']]
  ],
  [
    [['Шаги на месте', '2', '45 сек', 'Двигайся ритмично и сохраняй спокойное дыхание.'], ['Приседания до стула', '2', '10', 'Коснись стула и плавно вернись в исходное положение.'], ['Отжимания от стены', '2', '10', 'Не прогибай поясницу, двигайся плавно.'], ['Подъём на носки', '2', '15', 'Поднимайся и опускайся медленно, держась за опору.']],
    [['Кроки на місці', '2', '45 сек', 'Рухайся ритмічно та зберігай спокійне дихання.'], ['Присідання до стільця', '2', '10', 'Торкнись стільця та плавно повернись у вихідне положення.'], ['Віджимання від стіни', '2', '10', 'Не прогинай поперек, рухайся плавно.'], ['Підйом на носки', '2', '15', 'Повільно підіймайся й опускайся, тримаючись за опору.']],
    [['March in place', '2', '45 sec', 'Move rhythmically and keep your breathing steady.'], ['Chair squats', '2', '10', 'Tap the chair and return smoothly to standing.'], ['Wall push-ups', '2', '10', 'Avoid arching your back and move smoothly.'], ['Calf raises', '2', '15', 'Rise and lower slowly while holding support.']]
  ],
  [
    [['Наклоны головы и плеч', '2', '30 сек', 'Двигайся медленно, без рывков и боли.'], ['Круги плечами', '2', '10', 'Выполняй плавные круговые движения небольшой амплитуды.'], ['Мягкая растяжка задней поверхности бедра', '2', '20 сек', 'Слегка согни колено и не пружинь.'], ['Повороты грудного отдела', '2', '8 на каждую', 'Поворачивайся плавно, не форсируя амплитуду.']],
    [['Нахили голови та плечей', '2', '30 сек', 'Рухайся повільно, без ривків і болю.'], ['Кола плечима', '2', '10', 'Виконуй плавні кругові рухи невеликої амплітуди.'], ['М’яке розтягування задньої поверхні стегна', '2', '20 сек', 'Злегка зігни коліно та не пружинь.'], ['Повороти грудного відділу', '2', '8 на кожну', 'Повертайся плавно, не форсуючи амплітуду.']],
    [['Head and shoulder tilts', '2', '30 sec', 'Move slowly without sudden movements or pain.'], ['Shoulder circles', '2', '10', 'Make smooth circles with a comfortable range of motion.'], ['Gentle hamstring stretch', '2', '20 sec', 'Keep a soft knee and do not bounce.'], ['Upper-body rotations', '2', '8 each', 'Rotate smoothly without forcing the range.']]
  ],
  [
    [['Спокойная ходьба на месте', '2', '60 сек', 'Дыши ровно и двигайся в комфортном темпе.'], ['Подъём на носки', '2', '12', 'Держись за опору и выполняй движения плавно.'], ['Отведение рук в стороны', '2', '12', 'Не поднимай плечи к ушам.'], ['Мягкие приседания', '2', '8', 'Выбирай удобную глубину и сохраняй равновесие.']],
    [['Спокійна ходьба на місці', '2', '60 сек', 'Дихай рівно та рухайся у комфортному темпі.'], ['Підйом на носки', '2', '12', 'Тримайся за опору та виконуй рухи плавно.'], ['Відведення рук убік', '2', '12', 'Не підіймай плечі до вух.'], ['М’які присідання', '2', '8', 'Обирай зручну глибину та зберігай рівновагу.']],
    [['Easy march in place', '2', '60 sec', 'Breathe steadily and move at a comfortable pace.'], ['Calf raises', '2', '12', 'Hold a support and move smoothly.'], ['Side arm raises', '2', '12', 'Keep your shoulders away from your ears.'], ['Gentle squats', '2', '8', 'Choose a comfortable depth and maintain balance.']]
  ]
];

export default function App() {
  const [savedSession] = useState<SavedSession | null>(() => loadSavedSession());
  const [lang, setLang] = useState<Language>('RU');
  const [goal, setGoal] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<number | null>(
    () => savedSession?.activeWorkout ?? null
  );
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [calories, setCalories] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [sessionMode, setSessionMode] = useState<SessionMode>(
    () => savedSession?.sessionMode ?? 'idle'
  );
  const [pausedFrom, setPausedFrom] = useState<PausedFrom>(
    () => savedSession?.pausedFrom ?? null
  );
  const [exerciseIndex, setExerciseIndex] = useState(
    () => savedSession?.exerciseIndex ?? 0
  );
  const [setNumber, setSetNumber] = useState(
    () => savedSession?.setNumber ?? 1
  );
  const [restSeconds, setRestSeconds] = useState(
    () => savedSession?.restSeconds ?? 30
  );
  const [completedSets, setCompletedSets] = useState(
    () => savedSession?.completedSets ?? 0
  );
  const [sessionSeconds, setSessionSeconds] = useState(
    () => savedSession?.sessionSeconds ?? 0
  );

  const t = translations[lang];
  const languageIndex = lang === 'RU' ? 0 : lang === 'UK' ? 1 : 2;

  const visibleWorkouts = workoutLibrary
    .map((workout, index) => ({ ...workout, id: index }))
    .filter(workout => workout.goal === goal);

  const currentWorkout = activeWorkout === null ? null : workoutLibrary[activeWorkout];
  const currentExercises = currentWorkout
    ? exercisePlans[currentWorkout.goal][languageIndex]
    : [];

  const currentExercise = currentExercises[exerciseIndex];
  const totalSets = currentExercise ? Number(currentExercise[1]) : 0;
  const totalWorkoutSets = currentExercises.reduce((sum, item) => sum + Number(item[1]), 0);
  const progress = totalWorkoutSets > 0
    ? Math.round((completedSets / totalWorkoutSets) * 100)
    : 0;

  useEffect(() => {
    if (sessionMode !== 'rest' && sessionMode !== 'active') return;

    const interval = window.setInterval(() => {
      if (sessionMode === 'active') {
        setSessionSeconds(value => value + 1);
      }

      if (sessionMode === 'rest') {
        setRestSeconds(value => {
          if (value <= 1) {
            setSessionMode('active');
            return 0;
          }
          return value - 1;
        });
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [sessionMode]);

  // Сохраняем прогресс при каждом изменении состояния тренировки.
  useEffect(() => {
    if (activeWorkout === null) {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Локальное хранилище может быть недоступно.
      }
      return;
    }

    const sessionToSave: SavedSession = {
      version: 1,
      activeWorkout,
      sessionMode,
      pausedFrom,
      exerciseIndex,
      setNumber,
      restSeconds,
      completedSets,
      sessionSeconds
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionToSave));
    } catch {
      // При недоступности хранилища тренировка продолжит работать в этой вкладке.
    }
  }, [
    activeWorkout,
    sessionMode,
    pausedFrom,
    exerciseIndex,
    setNumber,
    restSeconds,
    completedSets,
    sessionSeconds
  ]);

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

  function resetSession() {
    setSessionMode('idle');
    setPausedFrom(null);
    setExerciseIndex(0);
    setSetNumber(1);
    setRestSeconds(30);
    setCompletedSets(0);
    setSessionSeconds(0);
  }

  function openWorkout(id: number) {
    setActiveWorkout(id);
    resetSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeWorkout() {
    setActiveWorkout(null);
    resetSession();
  }

  function startSession() {
    resetSession();
    setSessionMode('active');
  }

  function pauseSession() {
    if (sessionMode === 'active' || sessionMode === 'rest') {
      setPausedFrom(sessionMode);
      setSessionMode('paused');
    }
  }

  function resumeSession() {
    if (sessionMode === 'paused' && pausedFrom !== null) {
      setSessionMode(pausedFrom);
      setPausedFrom(null);
    }
  }

  function completeSet() {
    if (!currentExercise || sessionMode !== 'active') return;

    setCompletedSets(value => value + 1);

    if (setNumber < totalSets) {
      setSetNumber(value => value + 1);
      setRestSeconds(30);
      setSessionMode('rest');
      return;
    }

    if (exerciseIndex < currentExercises.length - 1) {
      setExerciseIndex(value => value + 1);
      setSetNumber(1);
      setRestSeconds(45);
      setSessionMode('rest');
      return;
    }

    setSessionMode('completed');
  }

  function skipRest() {
    if (sessionMode !== 'rest') return;
    setRestSeconds(0);
    setSessionMode('active');
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  }

  return (
    <main>
      {activeWorkout !== null && currentWorkout ? (
        <section className="workout-detail-page">
          <div className="workout-detail-top">
            <button className="detail-back" onClick={closeWorkout}>
              <ArrowLeft size={18} /> {t.back}
            </button>
            <span className="eyebrow">{t.workoutPlan}</span>
          </div>

          {sessionMode === 'completed' ? (
            <div className="session-complete">
              <div className="session-complete-icon"><Trophy size={42} /></div>
              <span className="eyebrow">{t.completed}</span>
              <h1>{t.congratulations}</h1>
              <p>{t.completedText}</p>
              <div className="session-stats">
                <div><strong>{completedSets}</strong><span>{t.setsDone}</span></div>
                <div><strong>{currentExercises.length}</strong><span>{t.exercisesDone}</span></div>
                <div><strong>{formatTime(sessionSeconds)}</strong><span>{t.totalTime}</span></div>
              </div>
              <button className="detail-start-button" onClick={closeWorkout}>
                {t.startAgain}<ArrowRight size={18} />
              </button>
            </div>
          ) : sessionMode === 'idle' ? (
            <>
              <div className="workout-detail-heading">
                <span className="eyebrow">{t.goalNames[currentWorkout.goal]}</span>
                <h1>{currentWorkout.title[languageIndex]}</h1>
                <p>{currentWorkout.description[languageIndex]}</p>
                <div className="detail-summary">
                  <span><Clock3 size={16} /> {currentWorkout.minutes} {t.duration}</span>
                  <span>{t.levels[currentWorkout.level]}</span>
                  <span>{currentExercises.length} {t.exercises.toLowerCase()}</span>
                </div>
              </div>

              <div className="detail-notice">
                <HeartPulse size={19} />
                <div><strong>{t.warmup}</strong><p>{t.safety}</p></div>
              </div>

              <div className="exercise-section">
                <span className="eyebrow">{t.workoutPlan}</span>
                <h2>{t.exercises}</h2>
                <div className="exercise-list">
                  {currentExercises.map((exercise, index) => (
                    <article className="exercise-card" key={`${activeWorkout}-${index}`}>
                      <div className="exercise-number">{String(index + 1).padStart(2, '0')}</div>
                      <div className="exercise-content">
                        <h3>{exercise[0]}</h3>
                        <div className="exercise-stats">
                          <span>{exercise[1]} {t.sets}</span>
                          <span>{exercise[2]} {t.reps}</span>
                        </div>
                        <span className="exercise-technique-label">{t.technique}</span>
                        <p>{exercise[3]}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rest-timer-card">
                <span className="eyebrow">{t.workoutPlan}</span>
                <h2>{currentWorkout.minutes} {t.duration}</h2>
                <p>{t.safety}</p>
                <button className="detail-start-button" onClick={startSession}>
                  <Play size={18} /> {t.startWorkout}
                </button>
              </div>
            </>
          ) : (
            <div className="session-screen">
              <div className="session-heading">
                <span className="eyebrow">{t.progress}</span>
                <h1>{currentWorkout.title[languageIndex]}</h1>
                <div className="session-progress-track">
                  <div style={{ width: `${progress}%` }} />
                </div>
                <div className="session-progress-label">
                  <span>{progress}%</span>
                  <span>{completedSets} / {totalWorkoutSets}</span>
                </div>
              </div>

              {(sessionMode === 'rest' ||
                (sessionMode === 'paused' && pausedFrom === 'rest')) ? (
                <div className="session-rest">
                  <span className="eyebrow">{t.rest}</span>
                  <h2>{formatTime(restSeconds)}</h2>
                  <p>{t.restMessage}</p>
                  <div className="session-rest-actions">
                    {sessionMode === 'rest' ? (
                      <>
                        <button className="timer-main-button" onClick={skipRest}>
                          <Play size={18} /> {t.skipRest}
                        </button>
                        <button className="timer-reset-button" onClick={pauseSession}>
                          <Pause size={17} /> {t.pause}
                        </button>
                      </>
                    ) : (
                      <button className="timer-main-button" onClick={resumeSession}>
                        <Play size={18} /> {t.resume}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="session-exercise">
                  <span className="eyebrow">{t.currentExercise}</span>
                  <div className="session-exercise-number">
                    {String(exerciseIndex + 1).padStart(2, '0')}
                  </div>
                  <h2>{currentExercise[0]}</h2>
                  <p className="session-technique">{currentExercise[3]}</p>

                  <div className="session-set-display">
                    <span>{t.set}</span>
                    <strong>{setNumber}</strong>
                    <span>{t.of} {totalSets}</span>
                  </div>

                  <div className="session-target">
                    <span>{currentExercise[2]}</span>
                    <small>{t.reps}</small>
                  </div>

                  <button
                    className="session-done-button"
                    onClick={completeSet}
                    disabled={sessionMode === 'paused'}
                  >
                    <Check size={19} /> {t.done}
                  </button>
                </div>
              )}

              <div className="session-bottom">
                <span><Clock3 size={15} /> {formatTime(sessionSeconds)}</span>
                <button
                  onClick={sessionMode === 'paused' ? resumeSession : pauseSession}
                >
                  {sessionMode === 'paused' ? <Play size={16} /> : <Pause size={16} />}
                  {sessionMode === 'paused' ? t.resume : t.pause}
                </button>
                <button onClick={closeWorkout}>{t.finish}</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
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
                  <ChevronDown className={languageOpen ? 'language-chevron rotated' : 'language-chevron'} size={14} />
                </button>
                {languageOpen && (
                  <div className="language-panel">
                    <span className="language-panel-label">LANGUAGE</span>
                    {([
                      ['RU', 'Русский'], ['UK', 'Українська'], ['EN', 'English']
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
                    onClick={() => setGoal(i)}
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
                  return (
                    <article className="workout-card" key={workout.id}>
                      <div className="workout-card-icon"><Icon size={23} /></div>
                      <h4>{workout.title[languageIndex]}</h4>
                      <p>{workout.description[languageIndex]}</p>
                      <div className="workout-meta">
                        <span><Clock3 size={14} /> {workout.minutes} {t.duration}</span>
                        <span>{t.levels[workout.level]}</span>
                      </div>
                      <button className="workout-select" onClick={() => openWorkout(workout.id)}>
                        {t.choose}<ArrowRight size={16} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="nutrition section" id="nutrition">
            <span className="eyebrow">{t.nutrition}</span>
            <h2>{t.nutritionTitle}</h2>
            <div className="calculator">
              <label>{t.age}<input type="number" value={age} onChange={e => setAge(e.target.value)} /></label>
              <label>{t.weight}<input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></label>
              <label>{t.height}<input type="number" value={height} onChange={e => setHeight(e.target.value)} /></label>
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
        </>
      )}
    </main>
  );
}
