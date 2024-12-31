const box = document.getElementById('box');
const message = document.getElementById('message');
const reactionTimeText = document.getElementById('time');
const sound = document.getElementById('sound');
const startButton = document.getElementById('startButton');

let startTime;
let timeoutId;
let reactionStarted = false;
let isFalseStart = false;
let isTestPaused = false;
let isTestCompleted = false;

// Задержка от 1 до 4 секунд
const randomDelay = () => Math.floor(Math.random() * 2000) + 1000;

function startReactionTest() {
  if (isTestCompleted || isFalseStart) return;

  box.style.backgroundColor = 'grey';
  message.textContent = 'Ждите, когда коробка станет зеленой...';

  timeoutId = setTimeout(() => {
    if (
      !reactionStarted &&
      !isTestPaused &&
      !isTestCompleted &&
      !isFalseStart
    ) {
      box.style.backgroundColor = 'green';
      startTime = Date.now();
      sound.play();
      message.textContent = 'Нажмите на коробку или нажмите пробел!';
      reactionStarted = true;
    }
  }, randomDelay());
}

function handleClick() {
  processReaction();
}

function handleKeyPress(event) {
  if (event.code === 'Space') {
    processReaction();
    event.preventDefault(); // Предотвращаем прокрутку страницы при нажатии пробела
  }
}

function processReaction() {
  if (isTestCompleted || isTestPaused || isFalseStart) {
    return;
  }

  if (!reactionStarted) {
    isFalseStart = true;
    box.style.backgroundColor = 'red';
    message.textContent =
      'Фальстарт! Вы нажали слишком рано! Нажмите на кнопку "Начать" для нового теста.';
    clearTimeout(timeoutId);
    endTest();
    return;
  }

  const reactionTime = Date.now() - startTime;
  reactionTimeText.textContent = `${reactionTime} мс`;
  message.textContent =
    'Тест завершен. Нажмите на кнопку "Начать" для нового теста.';

  isTestCompleted = true;
  clearTimeout(timeoutId);
  endTest();
}

function endTest() {
  box.removeEventListener('click', handleClick);
  window.removeEventListener('keydown', handleKeyPress); // Убираем обработчик нажатия клавиш
  box.style.pointerEvents = 'none';
}

function resetTest() {
  reactionStarted = false;
  isFalseStart = false;
  isTestPaused = false;
  isTestCompleted = false;
  box.style.backgroundColor = '';
  reactionTimeText.textContent = '';
  box.style.pointerEvents = 'auto';

  box.addEventListener('click', handleClick);
}

// Добавляем атрибуты доступности к квадрату
box.setAttribute('tabindex', '0'); // Позволяет фокусироваться на элементе
box.setAttribute('role', 'button'); // Указывает, что элемент ведет себя как кнопка

startButton.addEventListener('click', () => {
  if (isTestCompleted || isFalseStart) {
    resetTest();
    setTimeout(startReactionTest, 1000);
  } else if (reactionStarted || isTestPaused) {
    pauseTest(); // Функция pauseTest не определена в вашем коде
  }
});

// Начинаем первый тест по нажатию кнопки "Начать"
startButton.addEventListener('click', () => {
  resetTest();
  startReactionTest();
});

// Добавляем обработчик события для нажатия клавиш
window.addEventListener('keydown', handleKeyPress);

// Добавляем обработчик события для фокуса на квадрате
box.addEventListener('keydown', handleKeyPress);
