// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
let userBalance = 0;

// Main initialization function
function init() {
  tg.expand();
  tg.MainButton.setText("My Balance").show();
  tg.MainButton.onClick(showBalance);
  
  // Load user data (in a real app, this would come from your backend)
  loadUserData();
  
  // Set up tabs
  setupTabs();
  
  // Render initial content
  renderTasks();
}

// Load user data (simulated)
function loadUserData() {
  // In a real app, you would fetch this from your backend
  userBalance = localStorage.getItem('userBalance') || 0;
  document.getElementById('balance').textContent = userBalance;
  
  // Update tasks progress from localStorage
  config.tasks.forEach(task => {
    const savedTask = localStorage.getItem(`task_${task.id}`);
    if (savedTask) {
      task.currentCompletions = parseInt(savedTask);
    }
  });
}

// Save user data (simulated)
function saveUserData() {
  localStorage.setItem('userBalance', userBalance);
  config.tasks.forEach(task => {
    localStorage.setItem(`task_${task.id}`, task.currentCompletions);
  });
}

// Set up tab navigation
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding content
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      // Load content for the tab
      if (tabId === 'tasks') renderTasks();
      if (tabId === 'rewards') renderRewards();
      if (tabId === 'leaderboard') renderLeaderboard();
    });
  });
}

// Render tasks
function renderTasks() {
  const container = document.getElementById('tasks-tab');
  container.innerHTML = '';
  
  // Create daily tasks section
  const dailySection = document.createElement('div');
  dailySection.className = 'section';
  dailySection.innerHTML = `
    <h2 class="section__title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
      Daily Tasks
    </h2>
  `;
  container.appendChild(dailySection);
  
  // Create special offers section
  const offersSection = document.createElement('div');
  offersSection.className = 'section';
  offersSection.innerHTML = `
    <h2 class="section__title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
      </svg>
      Special Offers
    </h2>
  `;
  container.appendChild(offersSection);
  
  // Render tasks
  config.tasks.forEach(task => {
    const card = createTaskCard(task);
    if (task.type === 'daily') {
      dailySection.appendChild(card);
    } else {
      offersSection.appendChild(card);
    }
  });
}

// Create a task card element
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = `card ${task.type === 'daily' ? 'card--primary' : ''} ${task.type === 'offer' ? 'card--success' : ''}`;
  
  const progress = task.maxCompletions > 1 ? `
    <div class="card__progress">
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width: ${(task.currentCompletions / task.maxCompletions) * 100}%"></div>
      </div>
      <div class="progress-text">${task.currentCompletions}/${task.maxCompletions} completed</div>
    </div>
  ` : '';
  
  const isCompleted = task.currentCompletions >= task.maxCompletions;
  
  card.innerHTML = `
    <div class="card__header">
      <div class="card__title">${task.title}</div>
      <div class="card__reward">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
        ${task.reward}
      </div>
    </div>
    <div class="card__description">${task.description}</div>
    ${progress}
    <button class="button ${isCompleted ? 'button--disabled' : ''}" 
            data-task-id="${task.id}" 
            ${isCompleted ? 'disabled' : ''}>
      ${isCompleted ? 'Completed' : (task.type === 'survey' ? 'Continue' : 'Start')}
    </button>
  `;
  
  if (!isCompleted) {
    const button = card.querySelector('button');
    button.addEventListener('click', () => completeTask(task.id));
  }
  
  return card;
}

// Complete a task
function completeTask(taskId) {
  const task = config.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Increment completions
  task.currentCompletions++;
  
  // Add reward to balance
  userBalance += task.reward;
  document.getElementById('balance').textContent = userBalance;
  
  // Animate the balance
  const balanceElement = document.getElementById('balance');
  balanceElement.classList.add('earn-animation');
  setTimeout(() => {
    balanceElement.classList.remove('earn-animation');
  }, 500);
  
  // Save data
  saveUserData();
  
  // Re-render tasks
  renderTasks();
  
  // Show confirmation (in a real app, you might show a proper task completion screen)
  tg.showAlert(`You earned ${task.reward} ${config.currencyName}!`);
}

// Render rewards (placeholder)
function renderRewards() {
  const container = document.getElementById('rewards-tab');
  container.innerHTML = '<p style="text-align: center; padding: 20px;">Rewards coming soon!</p>';
}

// Render leaderboard (placeholder)
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-tab');
  container.innerHTML = '<p style="text-align: center; padding: 20px;">Leaderboard coming soon!</p>';
}

// Show balance info
function showBalance() {
  tg.showAlert(`Your current balance: ${userBalance} ${config.currencyName}`);
}

// Initialize the app when Telegram is ready
tg.ready();
init();
