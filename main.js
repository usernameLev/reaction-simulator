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
  if (isTestCompleted || isFalseStart) return; // Если тест завершен или был фальстарт, не запускаем новый тест

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
      sound.play(); // Воспроизводим звук
      message.textContent = 'Нажмите на коробку!';
      reactionStarted = true;
    }
  }, randomDelay());
}

function handleClick() {
  if (isTestCompleted || isTestPaused || isFalseStart) {
    return; // Если тест завершён, на паузе или был фальстарт, игнорируем клик
  }

  if (!reactionStarted) {
    // Если клик был произведён до того, как коробка стала зелёной, это фальстарт
    isFalseStart = true;
    box.style.backgroundColor = 'red'; // Коробка становится красной при фальстарте
    message.textContent =
      'Фальстарт! Вы нажали слишком рано! Нажмите на кнопку "Начать" для нового теста.';
    clearTimeout(timeoutId); // Останавливаем таймер
    endTest(); // Завершаем тест
    return;
  }

  const reactionTime = Date.now() - startTime;
  reactionTimeText.textContent = `${reactionTime} мс`;
  message.textContent =
    'Тест завершен. Нажмите на кнопку "Начать" для нового теста.';

  isTestCompleted = true; // Устанавливаем флаг завершения теста
  clearTimeout(timeoutId); // Останавливаем таймер
  endTest(); // Завершаем тест
}

function endTest() {
  box.removeEventListener('click', handleClick); // Убираем обработчик клика
  // Блокируем дальнейшие клики
  box.style.pointerEvents = 'none'; // Отключаем взаимодействие с коробкой
}

function resetTest() {
  reactionStarted = false;
  isFalseStart = false;
  isTestPaused = false;
  isTestCompleted = false;
  box.style.backgroundColor = ''; // Сбрасываем цвет коробки
  reactionTimeText.textContent = '';
  box.style.pointerEvents = 'auto'; // Включаем взаимодействие с коробкой

  box.addEventListener('click', handleClick); // Восстанавливаем обработчик клика
}

// Изменяем обработчик события для кнопки "Начать"
startButton.addEventListener('click', () => {
  if (isTestCompleted || isFalseStart) {
    resetTest(); // Сброс состояния перед новым запуском
    setTimeout(startReactionTest, 1000); // Задержка перед новым запуском
  } else if (reactionStarted || isTestPaused) {
    pauseTest(); // Приостановка теста, если он запущен (функция pauseTest не определена в вашем коде)
  }
});

// Начинаем первый тест по нажатию кнопки "Начать"
startButton.addEventListener('click', () => {
  resetTest();
  startReactionTest();
});
