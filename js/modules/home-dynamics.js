
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning!';
  if (hour >= 12 && hour < 17) return 'Good afternoon!';
  if (hour >= 17 && hour < 24) return 'Good evening!';
  return 'Good night!';
}

function initHomeGreeting() {
  const introBody = document.querySelector('#tab-home .intro-body');
  if (!introBody) return;
  const greeting = getTimeGreeting();
  introBody.innerHTML =
    'Welcome to my corner on the web! I\'m Sehansi, a Computer Science undergraduate, building mindful AI systems, ' +
    'open data platforms, and social-impact technology. Click through ' +
    'to explore my projects, writing, events, and background! Also, Clippy is here to help navigate you!';
}


function getTypingPhrases() {
  const timeGreeting = getTimeGreeting();
  return [
    'ආයුබෝවන්!',
    timeGreeting,
  ];
}

let _twIdx = 0;
let _twCharIdx = 0;
let _twDeleting = false;
let _twTimer = null;

function _twTick() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = getTypingPhrases();
  const phrase = phrases[_twIdx % phrases.length];

  if (!_twDeleting) {
    _twCharIdx++;
    el.textContent = phrase.substring(0, _twCharIdx);

    if (_twCharIdx >= phrase.length) {
      _twTimer = setTimeout(function () {
        _twDeleting = true;
        _twTick();
      }, 2500);
      return;
    }
    _twTimer = setTimeout(_twTick, 80 + Math.random() * 40);
  } else {
    _twCharIdx--;
    el.textContent = phrase.substring(0, _twCharIdx);

    if (_twCharIdx <= 0) {
      _twDeleting = false;
      _twIdx = (_twIdx + 1) % phrases.length;
      _twTimer = setTimeout(_twTick, 400);
      return;
    }
    _twTimer = setTimeout(_twTick, 40 + Math.random() * 20);
  }
}

function initTypewriter() {
  const heading = document.querySelector('#tab-home .intro-heading');
  if (!heading) return;

  const phrases = getTypingPhrases();
  const firstPhrase = phrases[0];
  _twIdx = 0;
  _twCharIdx = firstPhrase.length;
  _twDeleting = false;

  let textSpan = document.getElementById('typingText');
  if (!textSpan) {
    heading.innerHTML =
      '<span id="typingText">' + firstPhrase + '</span>' +
      '<span class="typing-cursor" aria-hidden="true"></span>';
  } else {
    textSpan.textContent = firstPhrase;
  }

  clearTimeout(_twTimer);
  _twTimer = setTimeout(function () {
    _twDeleting = true;
    _twTick();
  }, 2800);
}


function triggerEntranceAnimation(panelId) {
  document.querySelectorAll('.aero-tab-panel').forEach(function (p) {
    p.classList.remove('aero-entering');
  });

  const panel = document.getElementById('tab-' + panelId);
  if (!panel) return;

  panel.classList.add('aero-entering');
}


function initHomeDynamics() {
  initHomeGreeting();
  initTypewriter();
  triggerEntranceAnimation('home');
}
