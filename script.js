(() => {
  // State
  let currentUser = null;
  let selectedMode = null;
  let selectedDifficulty = null;
  let textToType = '';
  let startTime = null;
  let timerInterval = null;
  let typedText = '';
  let correctChars = 0;
  let totalChars = 0;
  let testCompleted = false;

  // DOM Elements
  const sections = {
    auth: document.getElementById('auth-section'),
    modeSelection: document.getElementById('mode-selection-section'),
    difficultySelection: document.getElementById('difficulty-selection-section'),
    typingTest: document.getElementById('typing-test-section'),
    leaderboard: document.getElementById('leaderboard-section'),
  };

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authMessage = document.getElementById('auth-message');

  const modeButtons = document.querySelectorAll('.mode-btn');
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');

  const textToTypeEl = document.getElementById('text-to-type');
  const typingInput = document.getElementById('typing-input');
  const wpmCounter = document.getElementById('wpm-counter');
  const accuracyCounter = document.getElementById('accuracy-counter');
  const testResult = document.getElementById('test-result');
  const submitScoreBtn = document.getElementById('submit-score-btn');

  const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const logoutBtn = document.getElementById('logout-btn');

  const modeBackBtn = document.getElementById('mode-back-btn');
  const difficultyBackBtn = document.getElementById('difficulty-back-btn');
  const testBackBtn = document.getElementById('test-back-btn');
  const leaderboardBackBtn = document.getElementById('leaderboard-back-btn');

  // Utility Functions
  function showSection(section) {
    Object.values(sections).forEach(s => s.classList.remove('active'));
    section.classList.add('active');
  }

  function beep() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }

  function calculateWPM() {
    const minutes = (Date.now() - startTime) / 60000;
    return minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  }

  function calculateAccuracy() {
    return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  }

  function highlightText() {
    const chars = textToType.split('');
    const inputChars = typingInput.value.split('');
    let html = '';
    correctChars = 0;
    totalChars = inputChars.length;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const typedChar = inputChars[i];
      if (typedChar == null) {
        html += `<span>${char}</span>`;
      } else if (typedChar === char) {
        html += `<span class="correct">${char}</span>`;
        correctChars++;
      } else {
        html += `<span class="incorrect">${char}</span>`;
        if (!testCompleted) beep();
      }
    }
    textToTypeEl.innerHTML = html;
  }

  function resetTest() {
    typingInput.value = '';
    testResult.textContent = '';
    submitScoreBtn.disabled = true;
    typedText = '';
    correctChars = 0;
    totalChars = 0;
    testCompleted = false;
    startTime = null;
    clearInterval(timerInterval);
    wpmCounter.textContent = 'WPM: 0';
    accuracyCounter.textContent = 'Accuracy: 100%';
    highlightText();
  }

  function endTest() {
    testCompleted = true;
    clearInterval(timerInterval);
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    if (accuracy > 90 && wpm > 40) {
      testResult.textContent = 'Victory!';
      testResult.style.color = 'var(--correct-color)';
    } else {
      testResult.textContent = 'Try Again!';
      testResult.style.color = 'var(--incorrect-color)';
    }
    submitScoreBtn.disabled = false;
  }

  // Event Handlers
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    authMessage.textContent = '';
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!username || !password) {
      authMessage.textContent = 'Please enter username and password.';
      return;
    }
    try {
      const res = await fetch('/api/login.js', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      });
      const data = await res.json();
      if (res.ok) {
        currentUser = data.user;
        showSection(sections.modeSelection);
      } else {
        authMessage.textContent = data.error || 'Login failed.';
      }
    } catch (err) {
      authMessage.textContent = 'Login error.';
    }
  });

  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    authMessage.textContent = '';
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    if (!username || !password) {
      authMessage.textContent = 'Please enter username and password.';
      return;
    }
    try {
      const res = await fetch('/api/register.js', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      });
      const data = await res.json();
      if (res.ok) {
        authMessage.textContent = 'Registration successful. Please login.';
        registerForm.reset();
      } else {
        authMessage.textContent = data.error || 'Registration failed.';
      }
    } catch (err) {
      authMessage.textContent = 'Registration error.';
    }
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMode = btn.dataset.mode;
      showSection(sections.difficultySelection);
    });
  });

  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      selectedDifficulty = btn.dataset.difficulty;
      resetTest();
      showSection(sections.typingTest);
      try {
        const res = await fetch(`/api/get-text.js?mode=${selectedMode}&difficulty=${selectedDifficulty}`);
        const data = await res.json();
        if (res.ok) {
          textToType = data.text;
          highlightText();
          typingInput.focus();
        } else {
          testResult.textContent = 'Failed to load text.';
        }
      } catch (err) {
        testResult.textContent = 'Error loading text.';
      }
    });
  });

  typingInput.addEventListener('input', () => {
    if (!startTime) {
      startTime = Date.now();
      timerInterval = setInterval(() => {
        wpmCounter.textContent = 'WPM: ' + calculateWPM();
        accuracyCounter.textContent = 'Accuracy: ' + calculateAccuracy() + '%';
      }, 1000);
    }
    highlightText();
    if (typingInput.value === textToType) {
      endTest();
    }
  });

  submitScoreBtn.addEventListener('click', async () => {
    if (!currentUser) return;
    const wpm = calculateWPM();
    const scoreData = {
      username: currentUser.username,
      mode: selectedMode,
      wpm,
      date: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/leaderboard.js', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(scoreData),
      });
      if (res.ok) {
        alert('Score submitted!');
        showLeaderboard();
      } else {
        alert('Failed to submit score.');
      }
    } catch (err) {
      alert('Error submitting score.');
    }
  });

  function showLeaderboard() {
    showSection(sections.leaderboard);
    fetch('/api/leaderboard.js')
      .then(res => res.json())
      .then(data => {
        leaderboardTableBody.innerHTML = '';
        data.forEach(entry => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${entry.username}</td>
            <td>${entry.mode}</td>
            <td>${entry.wpm}</td>
            <td>${new Date(entry.date).toLocaleString()}</td>
          `;
          leaderboardTableBody.appendChild(tr);
        });
      })
      .catch(() => {
        leaderboardTableBody.innerHTML = '<tr><td colspan="4">Failed to load leaderboard.</td></tr>';
      });
  }

  modeBackBtn.addEventListener('click', () => {
    showSection(sections.auth);
  });

  difficultyBackBtn.addEventListener('click', () => {
    showSection(sections.modeSelection);
  });

  testBackBtn.addEventListener('click', () => {
    showSection(sections.difficultySelection);
  });

  leaderboardBackBtn.addEventListener('click', () => {
    showSection(sections.modeSelection);
  });

  themeToggleBtn.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.toggle('male-theme');
      body.classList.remove('female-theme');
    } else if (body.classList.contains('male-theme')) {
      body.classList.remove('male-theme');
      body.classList.add('female-theme');
    } else if (body.classList.contains('female-theme')) {
      body.classList.remove('female-theme');
      body.classList.add('dark-theme');
    } else {
      body.classList.add('dark-theme');
    }
  });

  logoutBtn.addEventListener('click', () => {
    currentUser = null;
    selectedMode = null;
    selectedDifficulty = null;
    textToType = '';
    resetTest();
    showSection(sections.auth);
  });

  // Initialize
  showSection(sections.auth);
})();
