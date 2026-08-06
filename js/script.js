'use strict';

const LESSON_CONFIG = Object.freeze({
  contractId: "UCAN-L05-CEC-001",
  version: "1.0",
  releaseVersion: "1.0",
  lessonId: "UCAN-L05",
  lessonNumber: "05",
  lessonLabel: "Заняття 05",
  lessonTitle: "Принципи природоорієнтованих рішень (NBS) у містах",
  totalRoutes: 13,
  finalRoute: "R13",
  previousLessonUrl: "https://clusterceu-crypto.github.io/UCAN-Lesson04/",
  nextLessonUrl: "https://clusterceu-crypto.github.io/UCAN-Lesson06/",
  qaPreviewQuery: "?qa=1",
  storageNamespace: "ucan.lesson05.v1",
  progressStorageKey: "ucan.lesson05.v1.navigation",
  selfCheckStorageKey: "ucan.lesson05.v1.selfCheck",
  assessmentStorageKey: "ucan.lesson05.v1.assessment",
  completionStorageKey: "ucan.lesson05.v1.completion",
  portfolioStorageKey: "ucan.lesson05.v1.portfolio.nbsOpportunityCard",
  transitionStorageKey: "ucan.lesson05.v1.transition",
  assetPath: "assets/L05-A01_From_Urban_Problem_to_NBS_Opportunity_v1.0.png",
  portfolioPdfFilename: "UCAN_Картка_можливості_NBS.pdf",
  requiredPortfolioFieldCount: 9,
  conditionalPortfolioFieldCount: 1,
  assessmentQuestionCount: 5,
  assessmentPassCount: 5,
  routeLabels: Object.freeze({
    R01: "Навіщо це заняття",
    R02: "Зв’язок із Заняттям 04",
    R03: "Що таке NBS",
    R04: "NBS і декоративне озеленення",
    R05: "Цінність NBS",
    R06: "П’ять перевірок",
    R07: "Умовні міські ситуації",
    R08: "Перевірте себе",
    R09: "Практичне завдання",
    R10: "Перехід до Заняття 06",
    R11: "Ресурси",
    R12: "Підсумковий тест",
    R13: "Завершення і рефлексія"
  }),
  pdfRuntime: Object.freeze({
    library: "pdfmake",
    version: "0.2.21",
    runtimePath: "vendor/pdfmake.min.js",
    fontBundlePath: "vendor/vfs_fonts.js",
    networkUse: false
  })
});

const ROUTES = Object.keys(LESSON_CONFIG.routeLabels);
const REQUIRED_FIELDS = Object.freeze([
  "nbs_problem", "nbs_place", "nbs_solution", "nbs_nature_function",
  "nbs_resident_benefit", "nbs_service_impact", "nbs_stakeholders",
  "nbs_data_needed", "nbs_first_step"
]);
const ALL_FIELDS = Object.freeze([...REQUIRED_FIELDS, "nbs_next_check"]);
const FIELD_LABELS = Object.freeze({
  nbs_problem: "Проблема громади",
  nbs_place: "Місце / тип простору",
  nbs_solution: "Можливе природоорієнтоване рішення",
  nbs_nature_function: "Функція природи",
  nbs_resident_benefit: "Користь для мешканців",
  nbs_service_impact: "Вплив на послуги або інфраструктуру",
  nbs_stakeholders: "Хто має бути залучений",
  nbs_data_needed: "Які дані або спостереження потрібні",
  nbs_first_step: "Перший управлінський крок",
  nbs_next_check: "Що потрібно перевірити перед наступним рішенням"
});
const SELF_CHECK_KEYS = Object.freeze({
  "SC-01": "Потребує доопрацювання",
  "SC-02": "NBS-можливість",
  "SC-03": "Потребує доопрацювання",
  "SC-04": "NBS-можливість"
});
const SELF_CHECK_HINT = "Шукайте одночасно п’ять речей: проблема, люди, функція природи, відповідальність і догляд.";
const ASSESSMENT = Object.freeze({
  Q01: Object.freeze({ key: "B", explanation: "NBS пов’язує природний процес із конкретною міською проблемою." }),
  Q02: Object.freeze({ key: "C", explanation: "Починати потрібно з проблеми, місця, людей і потрібної функції." }),
  Q03: Object.freeze({ key: "B", explanation: "Опис містить проблему, природний механізм, перевірку умов і догляд." }),
  Q04: Object.freeze({ key: "B", explanation: "Без відповідальності й догляду рішення не стає стабільним управлінським інструментом." }),
  Q05: Object.freeze({ key: "C", explanation: "Артефакт заняття — Картка можливості NBS для громади." })
});

const nowIso = () => new Date().toISOString();
const deepClone = (value) => JSON.parse(JSON.stringify(value));
const routeNumber = (route) => Number(route.slice(1));
const percentageForRoute = (route) => Math.round((routeNumber(route) / LESSON_CONFIG.totalRoutes) * 100);
const orderedUniqueRoutes = (items) => ROUTES.filter((route) => items.includes(route));

function defaultNavigation() {
  return { schemaVersion: 1, lessonId: LESSON_CONFIG.lessonId, currentRoute: "R01", highestUnlockedRoute: "R01", visitedRoutes: ["R01"], updatedAt: nowIso() };
}
function defaultSelfCheck() {
  return { schemaVersion: 1, lessonId: LESSON_CONFIG.lessonId, answers: { "SC-01": null, "SC-02": null, "SC-03": null, "SC-04": null }, correct: { "SC-01": null, "SC-02": null, "SC-03": null, "SC-04": null }, attempts: { "SC-01": 0, "SC-02": 0, "SC-03": 0, "SC-04": 0 }, updatedAt: nowIso() };
}
function defaultPortfolio() {
  return { schemaVersion: 1, lessonId: LESSON_CONFIG.lessonId, fields: Object.fromEntries(ALL_FIELDS.map((id) => [id, ""])), isComplete: false, explicitlySaved: false, savedAt: null, updatedAt: nowIso() };
}
function defaultAssessment() {
  return { schemaVersion: 1, lessonId: LESSON_CONFIG.lessonId, answers: { Q01: null, Q02: null, Q03: null, Q04: null, Q05: null }, attempts: 0, correctCount: 0, passed: false, checkedAt: null, updatedAt: nowIso() };
}
function defaultCompletion() {
  return { schemaVersion: 1, lessonId: LESSON_CONFIG.lessonId, portfolioComplete: false, assessmentPassed: false, lessonComplete: false, completedAt: null, updatedAt: nowIso() };
}

const runtime = {
  qaMode: new URLSearchParams(window.location.search).get('qa') === '1',
  qaPreset: null,
  storageAvailable: true,
  memoryStore: new Map(),
  state: null,
  legitimateState: null,
  autosaveTimer: null,
  portfolioDirty: false,
  lastDialogTrigger: null
};

function isObject(value) { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function validBase(value) { return isObject(value) && value.schemaVersion === 1 && value.lessonId === LESSON_CONFIG.lessonId; }
function validNavigation(value) {
  return validBase(value) && ROUTES.includes(value.currentRoute) && ROUTES.includes(value.highestUnlockedRoute) && Array.isArray(value.visitedRoutes);
}
function validSelfCheck(value) { return validBase(value) && isObject(value.answers) && isObject(value.correct) && isObject(value.attempts); }
function validPortfolio(value) { return validBase(value) && isObject(value.fields) && ALL_FIELDS.every((id) => typeof value.fields[id] === 'string'); }
function validAssessment(value) { return validBase(value) && isObject(value.answers) && Object.keys(ASSESSMENT).every((id) => Object.hasOwn(value.answers, id)); }
function validCompletion(value) { return validBase(value) && typeof value.portfolioComplete === 'boolean' && typeof value.assessmentPassed === 'boolean'; }

function announce(message, target = document.getElementById('global-status')) {
  if (!target) return;
  target.textContent = '';
  window.setTimeout(() => { target.textContent = message; }, 10);
}

function detectStorage() {
  if (runtime.qaMode) return true;
  try {
    const key = `${LESSON_CONFIG.storageNamespace}.storage-test`;
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

function rawGet(key) {
  if (!runtime.storageAvailable) return runtime.memoryStore.get(key) ?? null;
  try { return localStorage.getItem(key); } catch (error) { return runtime.memoryStore.get(key) ?? null; }
}
function rawSet(key, value) {
  if (runtime.qaMode) return;
  if (!runtime.storageAvailable) { runtime.memoryStore.set(key, value); return; }
  try { localStorage.setItem(key, value); }
  catch (error) {
    runtime.storageAvailable = false;
    runtime.memoryStore.set(key, value);
    announce('Збереження у браузері недоступне. Дані зберігатимуться лише до закриття цієї сторінки.');
  }
}
function rawRemove(key) {
  if (runtime.qaMode) return;
  runtime.memoryStore.delete(key);
  if (!runtime.storageAvailable) return;
  try { localStorage.removeItem(key); } catch (error) { runtime.storageAvailable = false; }
}
function recoveryKey(sourceKey) {
  return `${LESSON_CONFIG.storageNamespace}.recovery.${encodeURIComponent(sourceKey)}.${nowIso().replace(/[:.]/g, '-')}`;
}
function loadState(key, factory, validator) {
  const raw = rawGet(key);
  if (raw === null) return factory();
  try {
    const parsed = JSON.parse(raw);
    if (!validator(parsed)) throw new Error('schema');
    return parsed;
  } catch (error) {
    if (!runtime.qaMode) {
      rawSet(recoveryKey(key), raw);
      rawRemove(key);
      announce('Пошкоджені збережені дані ізольовано. Відновлено безпечний порожній стан.');
    }
    return factory();
  }
}
function saveState(key, value) {
  value.updatedAt = nowIso();
  rawSet(key, JSON.stringify(value));
}

function loadAllStates() {
  const navigation = loadState(LESSON_CONFIG.progressStorageKey, defaultNavigation, validNavigation);
  const selfCheck = loadState(LESSON_CONFIG.selfCheckStorageKey, defaultSelfCheck, validSelfCheck);
  const portfolio = loadState(LESSON_CONFIG.portfolioStorageKey, defaultPortfolio, validPortfolio);
  const assessment = loadState(LESSON_CONFIG.assessmentStorageKey, defaultAssessment, validAssessment);
  const completion = loadState(LESSON_CONFIG.completionStorageKey, defaultCompletion, validCompletion);

  navigation.visitedRoutes = orderedUniqueRoutes(navigation.visitedRoutes.filter((route) => ROUTES.includes(route)));
  if (!navigation.visitedRoutes.includes('R01')) navigation.visitedRoutes.unshift('R01');
  if (navigation.currentRoute === 'R13' && !(completion.portfolioComplete && completion.assessmentPassed)) {
    navigation.currentRoute = 'R12';
    navigation.highestUnlockedRoute = 'R12';
    completion.lessonComplete = false;
    completion.completedAt = null;
  }
  return { navigation, selfCheck, portfolio, assessment, completion };
}

function persistAll() {
  if (runtime.qaMode) return;
  saveState(LESSON_CONFIG.progressStorageKey, runtime.state.navigation);
  saveState(LESSON_CONFIG.selfCheckStorageKey, runtime.state.selfCheck);
  saveState(LESSON_CONFIG.portfolioStorageKey, runtime.state.portfolio);
  saveState(LESSON_CONFIG.assessmentStorageKey, runtime.state.assessment);
  saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
}

function fillStaticLabels() {
  document.getElementById('previous-lesson-link').href = LESSON_CONFIG.previousLessonUrl;
  document.getElementById('next-lesson-link').href = LESSON_CONFIG.nextLessonUrl;
  document.getElementById('lesson-label').textContent = LESSON_CONFIG.lessonLabel;
  document.querySelectorAll('[data-route]').forEach((section) => {
    section.querySelector('[data-route-heading]').textContent = LESSON_CONFIG.routeLabels[section.dataset.route];
  });
}

function highestAllowedIndex() {
  if (runtime.qaMode) return ROUTES.length - 1;
  return ROUTES.indexOf(runtime.state.navigation.highestUnlockedRoute);
}

function updateNavigationForVisit(route) {
  if (runtime.qaMode) return;
  const state = runtime.state.navigation;
  state.currentRoute = route;
  if (!state.visitedRoutes.includes(route)) state.visitedRoutes.push(route);
  state.visitedRoutes = orderedUniqueRoutes(state.visitedRoutes);
  const number = routeNumber(route);
  if (number <= 11) {
    const next = ROUTES[number];
    if (ROUTES.indexOf(next) > ROUTES.indexOf(state.highestUnlockedRoute)) state.highestUnlockedRoute = next;
  }
  if (route === 'R13') {
    runtime.state.completion.lessonComplete = true;
    runtime.state.completion.completedAt = runtime.state.completion.completedAt || nowIso();
  }
  saveState(LESSON_CONFIG.progressStorageKey, state);
  saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
}

function syncCombinedGate() {
  const completion = runtime.state.completion;
  if (!runtime.qaMode) {
    completion.portfolioComplete = Boolean(runtime.state.portfolio.isComplete && runtime.state.portfolio.explicitlySaved);
    completion.assessmentPassed = Boolean(runtime.state.assessment.passed);
  }
  const gate = completion.portfolioComplete && completion.assessmentPassed;
  if (!runtime.qaMode) {
    if (gate) runtime.state.navigation.highestUnlockedRoute = 'R13';
    else if (runtime.state.navigation.highestUnlockedRoute === 'R13') runtime.state.navigation.highestUnlockedRoute = 'R12';
    if (!gate) {
      completion.lessonComplete = false;
      completion.completedAt = null;
      if (runtime.state.navigation.currentRoute === 'R13') runtime.state.navigation.currentRoute = 'R12';
    }
    saveState(LESSON_CONFIG.progressStorageKey, runtime.state.navigation);
    saveState(LESSON_CONFIG.completionStorageKey, completion);
  }
  return gate;
}

function showRoute(route, options = {}) {
  const targetIndex = ROUTES.indexOf(route);
  if (targetIndex < 0) return false;
  if (!runtime.qaMode && targetIndex > highestAllowedIndex()) return false;
  document.querySelectorAll('.route').forEach((section) => { section.hidden = section.dataset.route !== route; });
  runtime.state.navigation.currentRoute = route;
  if (!options.preview) updateNavigationForVisit(route);
  updateInterface(route);
  if (!options.keepFocus) document.querySelector(`#${route} [data-route-heading]`).focus({ preventScroll: true });
  if (!options.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  return true;
}

function updateInterface(route) {
  const label = LESSON_CONFIG.routeLabels[route];
  const number = routeNumber(route);
  const percentage = percentageForRoute(route);
  const context = `Сторінка ${number} з ${LESSON_CONFIG.totalRoutes}`;
  document.getElementById('header-route-label').textContent = label;
  document.getElementById('progress-route-label').textContent = label;
  document.getElementById('progress-page-context').textContent = context;
  document.getElementById('progress-percentage').textContent = `${percentage}%`;
  document.getElementById('progress-fill').style.width = `${percentage}%`;
  const progressBar = document.getElementById('progress-bar');
  progressBar.setAttribute('aria-valuenow', String(percentage));
  progressBar.setAttribute('aria-label', `${label}. ${context}. ${percentage}%`);
  document.getElementById('sticky-route-label').textContent = label;
  document.getElementById('sticky-page-context').textContent = context;

  const back = document.getElementById('route-back');
  const next = document.getElementById('route-next');
  const nextLesson = document.getElementById('next-lesson-link');
  const isFirst = route === 'R01';
  const isFinal = route === 'R13';
  back.disabled = isFirst;
  back.setAttribute('aria-disabled', String(isFirst));
  back.tabIndex = isFirst ? -1 : 0;
  next.hidden = isFinal;
  nextLesson.hidden = !isFinal;
  if (!isFinal) {
    const nextRoute = ROUTES[number];
    const blockedByGate = route === 'R12' && !syncCombinedGate();
    next.disabled = blockedByGate || (!runtime.qaMode && ROUTES.indexOf(nextRoute) > highestAllowedIndex());
    next.setAttribute('aria-disabled', String(next.disabled));
    if (route === 'R12') next.setAttribute('aria-describedby', 'r12-gate-description');
    else next.removeAttribute('aria-describedby');
  }

  const completed = route === 'R13' && (runtime.qaMode || runtime.state.completion.lessonComplete);
  document.getElementById('completion-status').hidden = !completed;
  updateOutgoingValue();
}

function updateOutgoingValue() {
  const box = document.getElementById('outgoing-field-value');
  const value = runtime.state.portfolio.fields.nbs_next_check.trim();
  box.hidden = value === '';
  box.querySelector('p').textContent = value;
}

function renderStateIntoForms() {
  ALL_FIELDS.forEach((id) => {
    const field = document.getElementById(id);
    if (field) field.value = runtime.state.portfolio.fields[id] || '';
  });
  Object.entries(runtime.state.selfCheck.answers).forEach(([id, value]) => {
    if (value) {
      const radio = document.querySelector(`input[name="${id}"][value="${CSS.escape(value)}"]`);
      if (radio) radio.checked = true;
      renderSelfCheckFeedback(id);
    }
  });
  Object.entries(runtime.state.assessment.answers).forEach(([id, value]) => {
    if (value) {
      const radio = document.querySelector(`input[name="${id}"][value="${value}"]`);
      if (radio) radio.checked = true;
    }
  });
  if (runtime.state.assessment.checkedAt) renderAssessmentFeedback();
  updatePdfButton();
  updateOutgoingValue();
}

function portfolioCurrentFields() {
  return Object.fromEntries(ALL_FIELDS.map((id) => [id, document.getElementById(id).value.trim()]));
}
function invalidRequiredFields(fields = portfolioCurrentFields()) {
  return REQUIRED_FIELDS.filter((id) => fields[id].trim() === '');
}
function updatePdfButton() {
  const invalid = invalidRequiredFields();
  document.getElementById('portfolio-pdf').disabled = invalid.length > 0;
  document.getElementById('pdf-requirements').textContent = invalid.length > 0
    ? 'PDF доступний після заповнення дев’яти обов’язкових полів.'
    : 'PDF готовий до локального формування.';
}
function savePortfolioDraft({ explicit = false } = {}) {
  if (!explicit && !runtime.portfolioDirty) return true;
  const fields = portfolioCurrentFields();
  runtime.state.portfolio.fields = fields;
  runtime.state.portfolio.updatedAt = nowIso();
  if (explicit) {
    const invalid = invalidRequiredFields(fields);
    if (invalid.length > 0) {
      runtime.state.portfolio.isComplete = false;
      runtime.state.portfolio.explicitlySaved = false;
      runtime.state.portfolio.savedAt = null;
      runtime.state.completion.portfolioComplete = false;
      invalidateLessonCompletion();
      saveState(LESSON_CONFIG.portfolioStorageKey, runtime.state.portfolio);
      saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
      showPortfolioErrors(invalid, true);
      announce('Заповніть дев’ять обов’язкових полів і повторіть збереження.', document.getElementById('portfolio-status'));
      return false;
    }
    runtime.state.portfolio.isComplete = true;
    runtime.state.portfolio.explicitlySaved = true;
    runtime.state.portfolio.savedAt = nowIso();
    runtime.state.completion.portfolioComplete = true;
    clearPortfolioErrors();
    announce('Картку збережено у Портфелі мера.', document.getElementById('portfolio-status'));
  }
  saveState(LESSON_CONFIG.portfolioStorageKey, runtime.state.portfolio);
  runtime.portfolioDirty = false;
  syncCombinedGate();
  updatePdfButton();
  return true;
}
function invalidateLessonCompletion() {
  runtime.state.completion.lessonComplete = false;
  runtime.state.completion.completedAt = null;
  if (runtime.state.navigation.highestUnlockedRoute === 'R13') runtime.state.navigation.highestUnlockedRoute = 'R12';
}
function portfolioEdited() {
  runtime.portfolioDirty = true;
  runtime.state.portfolio.fields = portfolioCurrentFields();
  runtime.state.portfolio.isComplete = false;
  runtime.state.portfolio.explicitlySaved = false;
  runtime.state.portfolio.savedAt = null;
  runtime.state.completion.portfolioComplete = false;
  invalidateLessonCompletion();
  updatePdfButton();
  updateOutgoingValue();
  clearTimeout(runtime.autosaveTimer);
  runtime.autosaveTimer = window.setTimeout(() => savePortfolioDraft(), 500);
}

function showPortfolioErrors(invalidIds, focusSummary) {
  const summary = document.getElementById('portfolio-error-summary');
  const links = document.getElementById('portfolio-error-links');
  links.textContent = '';
  ALL_FIELDS.forEach((id) => {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    if (!error) return;
    const invalid = invalidIds.includes(id);
    field.setAttribute('aria-invalid', String(invalid));
    error.hidden = !invalid;
    error.textContent = invalid ? `Заповніть поле «${FIELD_LABELS[id]}».` : '';
    if (invalid) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = `Заповніть поле «${FIELD_LABELS[id]}»`;
      li.append(link);
      links.append(li);
    }
  });
  summary.hidden = invalidIds.length === 0;
  if (focusSummary && invalidIds.length > 0) summary.focus();
}
function clearPortfolioErrors() {
  document.getElementById('portfolio-error-summary').hidden = true;
  REQUIRED_FIELDS.forEach((id) => {
    const field = document.getElementById(id);
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(`${id}-error`);
    error.hidden = true;
    error.textContent = '';
  });
}

function renderSelfCheckFeedback(id) {
  const selected = runtime.state.selfCheck.answers[id];
  const correct = SELF_CHECK_KEYS[id];
  const feedback = document.getElementById(`${id}-feedback`);
  if (!selected) { feedback.textContent = SELF_CHECK_HINT; feedback.className = 'feedback'; return; }
  const isCorrect = selected === correct;
  feedback.textContent = isCorrect ? `Правильно: ${correct}. ${SELF_CHECK_HINT}` : `Потребує перегляду. Правильна класифікація: ${correct}. ${SELF_CHECK_HINT}`;
  feedback.className = `feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
}
function handleSelfCheckChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;
  const id = input.name;
  runtime.state.selfCheck.answers[id] = input.value;
  runtime.state.selfCheck.correct[id] = input.value === SELF_CHECK_KEYS[id];
  runtime.state.selfCheck.attempts[id] += 1;
  saveState(LESSON_CONFIG.selfCheckStorageKey, runtime.state.selfCheck);
  renderSelfCheckFeedback(id);
}

function renderAssessmentFeedback() {
  let correctCount = 0;
  Object.keys(ASSESSMENT).forEach((id) => {
    const selected = runtime.state.assessment.answers[id];
    const correct = selected === ASSESSMENT[id].key;
    if (correct) correctCount += 1;
    const feedback = document.getElementById(`${id}-feedback`);
    if (!runtime.state.assessment.checkedAt) { feedback.textContent = ''; feedback.className = 'feedback'; return; }
    feedback.textContent = `${correct ? 'Правильно.' : 'Потребує перегляду.'} ${ASSESSMENT[id].explanation}`;
    feedback.className = `feedback ${correct ? 'is-correct' : 'is-incorrect'}`;
  });
  const passed = correctCount === LESSON_CONFIG.assessmentPassCount;
  document.getElementById('assessment-summary').textContent = passed ? 'Усі п’ять відповідей правильні.' : 'Перегляньте пояснення та спробуйте ще раз.';
  return { correctCount, passed };
}
function handleAssessmentChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;
  runtime.state.assessment.answers[input.name] = input.value;
  if (runtime.state.assessment.passed) {
    runtime.state.assessment.passed = false;
    runtime.state.assessment.correctCount = 0;
    runtime.state.assessment.checkedAt = null;
    runtime.state.completion.assessmentPassed = false;
    invalidateLessonCompletion();
    document.querySelectorAll('#assessment-form .feedback').forEach((item) => { item.textContent = ''; item.className = item.id === 'assessment-summary' ? 'feedback assessment-summary' : 'feedback'; });
  }
  saveState(LESSON_CONFIG.assessmentStorageKey, runtime.state.assessment);
  saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
  syncCombinedGate();
  updateInterface(runtime.state.navigation.currentRoute);
}
function checkAssessment() {
  runtime.state.assessment.attempts += 1;
  runtime.state.assessment.checkedAt = nowIso();
  const { correctCount, passed } = renderAssessmentFeedback();
  runtime.state.assessment.correctCount = correctCount;
  runtime.state.assessment.passed = passed;
  runtime.state.completion.assessmentPassed = passed;
  if (!passed) invalidateLessonCompletion();
  saveState(LESSON_CONFIG.assessmentStorageKey, runtime.state.assessment);
  saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
  syncCombinedGate();
  updateInterface('R12');
  document.getElementById('assessment-check').focus({ preventScroll: true });
}

function buildPdfDefinition(fields) {
  const date = new Intl.DateTimeFormat('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
  const rows = ALL_FIELDS.map((id) => ([
    { text: FIELD_LABELS[id], bold: true, color: '#17324d', margin: [0, 2, 8, 6] },
    { text: fields[id] || '', margin: [0, 2, 0, 6] }
  ]));
  return {
    pageSize: 'A4',
    pageMargins: [46, 50, 46, 50],
    info: { title: 'Картка можливості NBS для громади', subject: `${LESSON_CONFIG.lessonId} · Портфель мера`, creator: 'UCAN Lesson 05 static package' },
    content: [
      { text: 'UCAN', style: 'brand' },
      { text: `${LESSON_CONFIG.lessonId} · ${LESSON_CONFIG.lessonLabel}`, style: 'lesson' },
      { text: 'Картка можливості NBS для громади', style: 'title' },
      { text: 'Портфель мера', style: 'portfolio' },
      { text: `Дата формування: ${date}`, style: 'date' },
      { table: { headerRows: 0, widths: [180, '*'], dontBreakRows: true, body: rows }, layout: {
        hLineWidth: () => 0.7, vLineWidth: () => 0.7,
        hLineColor: () => '#c7d1d8', vLineColor: () => '#c7d1d8',
        paddingLeft: () => 9, paddingRight: () => 9, paddingTop: () => 8, paddingBottom: () => 8
      }}
    ],
    styles: {
      brand: { fontSize: 12, bold: true, color: '#1f6b57', characterSpacing: 1.5, margin: [0, 0, 0, 8] },
      lesson: { fontSize: 10, color: '#526777', margin: [0, 0, 0, 12] },
      title: { fontSize: 21, bold: true, color: '#17324d', margin: [0, 0, 0, 5] },
      portfolio: { fontSize: 12, bold: true, color: '#1f6b57', margin: [0, 0, 0, 4] },
      date: { fontSize: 9, color: '#526777', margin: [0, 0, 0, 18] }
    },
    defaultStyle: { font: 'Roboto', fontSize: 10.5, lineHeight: 1.25, color: '#17324d' }
  };
}
function pdfRuntimeReady() {
  return typeof window.pdfMake === 'object' && typeof window.pdfMake.createPdf === 'function';
}
function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadPortfolioPdf() {
  const status = document.getElementById('portfolio-status');
  if (runtime.qaMode) { announce('PDF не формується у Creator QA Preview.', status); return; }
  const fields = portfolioCurrentFields();
  const invalid = invalidRequiredFields(fields);
  if (invalid.length > 0) {
    showPortfolioErrors(invalid, false);
    announce('Заповніть дев’ять обов’язкових полів і повторіть завантаження PDF.', status);
    return;
  }
  if (!pdfRuntimeReady()) {
    announce('Не вдалося сформувати PDF. Локальний PDF runtime або шрифти недоступні.', status);
    return;
  }
  try {
    const documentHandle = window.pdfMake.createPdf(buildPdfDefinition(fields));
    documentHandle.getBlob((blob) => {
      if (!(blob instanceof Blob) || blob.size === 0) {
        announce('Не вдалося сформувати PDF. Локальні шрифти недоступні.', status);
        return;
      }
      triggerBlobDownload(blob, LESSON_CONFIG.portfolioPdfFilename);
      announce('PDF сформовано локально.', status);
    });
  } catch (error) {
    console.error('PDF generation failed', error);
    announce('Не вдалося сформувати PDF. Перевірте локальні файли PDF runtime.', status);
  }
}

function openDialog(dialog, trigger) {
  runtime.lastDialogTrigger = trigger;
  dialog.showModal();
}
function handleResetDialogClose() {
  const dialog = document.getElementById('reset-dialog');
  if (dialog.returnValue === 'confirm') {
    rawRemove(LESSON_CONFIG.progressStorageKey);
    rawRemove(LESSON_CONFIG.selfCheckStorageKey);
    rawRemove(LESSON_CONFIG.assessmentStorageKey);
    rawRemove(LESSON_CONFIG.completionStorageKey);
    runtime.state.navigation = defaultNavigation();
    runtime.state.selfCheck = defaultSelfCheck();
    runtime.state.assessment = defaultAssessment();
    runtime.state.completion = defaultCompletion();
    persistAll();
    renderStateIntoForms();
    showRoute('R01', { keepScroll: true });
    announce('Прогрес заняття очищено. Картку збережено.');
  } else if (runtime.lastDialogTrigger) runtime.lastDialogTrigger.focus();
}
function handleDeleteDialogClose() {
  const dialog = document.getElementById('delete-dialog');
  if (dialog.returnValue === 'confirm') {
    rawRemove(LESSON_CONFIG.portfolioStorageKey);
    runtime.state.portfolio = defaultPortfolio();
    runtime.state.completion.portfolioComplete = false;
    invalidateLessonCompletion();
    saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
    renderStateIntoForms();
    clearPortfolioErrors();
    announce('Картку очищено.', document.getElementById('portfolio-status'));
  } else if (runtime.lastDialogTrigger) runtime.lastDialogTrigger.focus();
}

function handleAssetFailure() {
  const image = document.getElementById('approved-asset');
  image.hidden = true;
  document.getElementById('approved-asset-fallback').hidden = false;
  announce(`Не вдалося завантажити зображення ${image.getAttribute('src')}. Текстовий опис доступний.`);
}
function resetAssetView() {
  const image = document.getElementById('approved-asset');
  image.hidden = false;
  image.src = LESSON_CONFIG.assetPath;
  document.getElementById('approved-asset-fallback').hidden = true;
}
function showLinkFailure(link) {
  const fallback = link.parentElement.querySelector('.link-fallback');
  fallback.hidden = false;
  fallback.innerHTML = '';
  fallback.append('Посилання зараз недоступне. Точна адреса: ');
  const address = document.createElement('a');
  address.href = link.href;
  address.textContent = link.href;
  fallback.append(address);
  announce('Зовнішнє посилання недоступне. Точну адресу збережено без підміни.');
}

function setupQaPreview() {
  if (!runtime.qaMode) return;
  runtime.legitimateState = deepClone(runtime.state);
  const cleanUrl = `${window.location.pathname}${window.location.hash}`;
  history.replaceState(null, '', cleanUrl);
  const panel = document.getElementById('qa-preview');
  panel.hidden = false;
  const routeSelect = document.getElementById('qa-route-select');
  ROUTES.forEach((route) => {
    const option = document.createElement('option');
    option.value = route;
    option.textContent = `${route} · ${LESSON_CONFIG.routeLabels[route]}`;
    routeSelect.append(option);
  });
  routeSelect.value = runtime.state.navigation.currentRoute;
  routeSelect.addEventListener('change', () => showRoute(routeSelect.value, { preview: true }));
  document.getElementById('qa-apply').addEventListener('click', applyQaPreset);
  document.getElementById('qa-exit').addEventListener('click', exitQaPreview);
}
function applyQaPreset() {
  runtime.state = deepClone(runtime.legitimateState);
  runtime.qaPreset = document.getElementById('qa-preset-select').value;
  resetAssetView();
  document.querySelectorAll('.link-fallback').forEach((item) => { item.hidden = true; item.textContent = ''; });
  const sample = {
    nbs_problem: 'Перегрів пішохідного маршруту до зупинки та школи у літній період.',
    nbs_place: 'Вулиця з інтенсивним пішохідним рухом, зупинка та прилеглий шкільний маршрут.',
    nbs_solution: 'Тіньовий зелений коридор із деревами та водопроникними ділянками після перевірки умов.',
    nbs_nature_function: 'Створювати тінь, зменшувати перегрів і підтримувати локальне поглинання опадів.',
    nbs_resident_benefit: 'Безпечніший і комфортніший маршрут для дітей, старших людей та інших пішоходів.',
    nbs_service_impact: 'Надійніший пішохідний доступ до зупинки та школи під час спеки й опадів.',
    nbs_stakeholders: 'Відділи благоустрою, освіти й мобільності, комунальні служби, школа та мешканці.',
    nbs_data_needed: 'Температура поверхні, напрямок стоку, стан ґрунту, потоки пішоходів і можливості догляду.',
    nbs_first_step: 'Провести спільний огляд маршруту та погодити ділянку для першої перевірки.',
    nbs_next_check: 'Перевірити напрямок стоку й водопроникність ґрунту перед наступним рішенням.'
  };
  const preset = runtime.qaPreset;
  if (['portfolioComplete', 'combinedGate', 'r13'].includes(preset)) {
    runtime.state.portfolio.fields = sample;
    runtime.state.portfolio.isComplete = true;
    runtime.state.portfolio.explicitlySaved = true;
    runtime.state.completion.portfolioComplete = true;
  }
  if (preset === 'portfolioIncomplete') runtime.state.portfolio.fields.nbs_problem = 'Перегрів маршруту.';
  if (['assessmentPassed', 'combinedGate', 'r13'].includes(preset)) {
    Object.entries(ASSESSMENT).forEach(([id, data]) => { runtime.state.assessment.answers[id] = data.key; });
    runtime.state.assessment.passed = true;
    runtime.state.assessment.correctCount = 5;
    runtime.state.assessment.checkedAt = nowIso();
    runtime.state.completion.assessmentPassed = true;
  }
  if (preset === 'assessmentFailed') {
    Object.keys(ASSESSMENT).forEach((id) => { runtime.state.assessment.answers[id] = 'A'; });
    runtime.state.assessment.checkedAt = nowIso();
  }
  if (preset === 'r12Locked') {
    runtime.state.completion.portfolioComplete = false;
    runtime.state.completion.assessmentPassed = false;
  }
  renderStateIntoForms();
  if (preset === 'imageFailure') { showRoute('R03', { preview: true }); handleAssetFailure(); }
  else if (preset === 'linkFailure') { showRoute('R11', { preview: true }); document.querySelectorAll('.external-resource').forEach(showLinkFailure); }
  else if (preset === 'storageUnavailable') { showRoute('R09', { preview: true }); announce('Збереження у браузері недоступне. Дані зберігатимуться лише до закриття цієї сторінки.'); }
  else if (preset === 'longMobileLabels') showRoute('R09', { preview: true });
  else if (preset === 'r13') showRoute('R13', { preview: true });
  else if (['r12Locked', 'assessmentFailed', 'assessmentPassed', 'combinedGate'].includes(preset)) showRoute('R12', { preview: true });
  else if (['portfolioIncomplete', 'portfolioComplete'].includes(preset)) showRoute('R09', { preview: true });
  else showRoute('R01', { preview: true });
  document.getElementById('qa-route-select').value = runtime.state.navigation.currentRoute;
}
function exitQaPreview() {
  runtime.state = deepClone(runtime.legitimateState);
  window.location.replace(`${window.location.pathname}`);
}

function bindEvents() {
  document.getElementById('route-back').addEventListener('click', () => {
    const current = runtime.state.navigation.currentRoute;
    const index = ROUTES.indexOf(current);
    if (index > 0) showRoute(ROUTES[index - 1]);
  });
  document.getElementById('route-next').addEventListener('click', () => {
    const current = runtime.state.navigation.currentRoute;
    const index = ROUTES.indexOf(current);
    if (index < ROUTES.length - 1) showRoute(ROUTES[index + 1]);
  });
  document.getElementById('self-check-form').addEventListener('change', handleSelfCheckChange);
  document.getElementById('assessment-form').addEventListener('change', handleAssessmentChange);
  document.getElementById('assessment-check').addEventListener('click', checkAssessment);
  const portfolioForm = document.getElementById('portfolio-form');
  portfolioForm.addEventListener('input', portfolioEdited);
  portfolioForm.addEventListener('change', portfolioEdited);
  portfolioForm.addEventListener('focusout', (event) => { if (event.target instanceof HTMLTextAreaElement) savePortfolioDraft(); });
  document.getElementById('portfolio-save').addEventListener('click', () => savePortfolioDraft({ explicit: true }));
  document.getElementById('portfolio-pdf').addEventListener('click', downloadPortfolioPdf);
  document.getElementById('reset-button').addEventListener('click', (event) => openDialog(document.getElementById('reset-dialog'), event.currentTarget));
  document.getElementById('portfolio-delete').addEventListener('click', (event) => openDialog(document.getElementById('delete-dialog'), event.currentTarget));
  document.getElementById('reset-dialog').addEventListener('close', handleResetDialogClose);
  document.getElementById('delete-dialog').addEventListener('close', handleDeleteDialogClose);
  document.getElementById('approved-asset').addEventListener('error', handleAssetFailure);
  document.querySelectorAll('.external-resource').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (runtime.qaPreset === 'linkFailure' || navigator.onLine === false) {
        event.preventDefault();
        showLinkFailure(link);
      }
    });
  });
  document.getElementById('next-lesson-link').addEventListener('click', (event) => {
    if (runtime.qaPreset === 'linkFailure' || navigator.onLine === false) {
      event.preventDefault();
      announce(`Наступне заняття зараз недоступне. Точна адреса: ${LESSON_CONFIG.nextLessonUrl}`);
    }
  });
  window.addEventListener('pagehide', () => savePortfolioDraft());
}

function init() {
  fillStaticLabels();
  runtime.storageAvailable = detectStorage();
  if (!runtime.storageAvailable) announce('Збереження у браузері недоступне. Дані зберігатимуться лише до закриття цієї сторінки.');
  runtime.state = loadAllStates();
  if (runtime.qaMode) runtime.legitimateState = deepClone(runtime.state);
  bindEvents();
  renderStateIntoForms();
  setupQaPreview();
  const initialRoute = runtime.qaMode ? runtime.state.navigation.currentRoute : runtime.state.navigation.currentRoute;
  showRoute(initialRoute, { keepFocus: true, keepScroll: true, preview: runtime.qaMode });
  if (!runtime.qaMode) {
    saveState(LESSON_CONFIG.progressStorageKey, runtime.state.navigation);
    saveState(LESSON_CONFIG.completionStorageKey, runtime.state.completion);
  }
}

document.addEventListener('DOMContentLoaded', init);
