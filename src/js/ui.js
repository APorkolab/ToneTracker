import { DOM, STRINGS } from './constants.js';
import { state } from './state.js';
import { storage } from './storage.js';
import { i18n } from './i18n.js';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  let timeString = '';
  if (hours > 0) {
    timeString += `${hours} óra `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes} perc `;
  }
  timeString += `${secondsLeft} másodperc`;

  return timeString;
}

export function updateUserColor(color) {
  DOM.userColor.style.backgroundColor = color;
}

export function updateRandomColor(color, text = '') {
  DOM.randomColor.style.backgroundColor = color;
  DOM.randomColor.textContent = text;
}

export function updateFeedback(message) {
  DOM.feedback.textContent = message;
  // Re-trigger animation
  DOM.feedback.classList.remove('feedback-animate');
  void DOM.feedback.offsetWidth; // Trigger reflow
  DOM.feedback.classList.add('feedback-animate');
}

export function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
  DOM.timer.textContent = formatTime(elapsedTime);
}

export function updateScore() {
  DOM.score.textContent = state.score;
}

export function updateComponentButtonsState(hex) {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  DOM.plusRedButton.disabled = r >= 255;
  DOM.minusRedButton.disabled = r <= 0;
  DOM.plusGreenButton.disabled = g >= 255;
  DOM.minusGreenButton.disabled = g <= 0;
  DOM.plusBlueButton.disabled = b >= 255;
  DOM.minusBlueButton.disabled = b <= 0;
}

export function updateTipButton() {
  if (state.computerTipCount > 0) {
    DOM.computerGuessButton.disabled = false;
    DOM.computerGuessButton.textContent = STRINGS.computerTip(
      state.computerTipCount
    );
  } else {
    DOM.computerGuessButton.disabled = true;
    DOM.computerGuessButton.textContent = STRINGS.noMoreTips;
  }
}

export function showModal() {
  document.body.classList.add('modal-open');
}

export function hideModal() {
  document.body.classList.remove('modal-open');
}

export function showResultModal() {
  DOM.correctColorCode.textContent = state.generatedColor;
  showModal();
}

export function disableGameControls() {
  DOM.checkButton.disabled = true;
  DOM.computerGuessButton.disabled = true;
  DOM.allSecondaryButtons.forEach((btn) => (btn.disabled = true));
}

export function enableGameControls() {
  DOM.checkButton.disabled = false;
  DOM.computerGuessButton.disabled = false;
  DOM.allSecondaryButtons.forEach((btn) => (btn.disabled = false));
}

export function playSound(type) {
  try {
    const sound = new Audio(`/${type}.mp3`);
    sound.play();
  } catch (error) {
    console.error('Hangfájl hiba: ', error);
    updateFeedback('Hiba történt a hang lejátszása közben.');
  }
}

export function setPulseAnimation(shouldPulse) {
    if (shouldPulse) {
        DOM.randomColor.classList.add('pulsing');
    } else {
        DOM.randomColor.classList.remove('pulsing');
    }
}

export function resetUI() {
  DOM.colorInput.value = '';
  DOM.userColor.style.backgroundColor = '#FFFFFF';
  DOM.feedback.textContent = '';
  DOM.timer.textContent = '0';
  updateScore();
}

/**
 * Update statistics display with latest game data
 */
export function updateStatistics() {
  try {
    // Get game statistics from storage
    const gameHistory = storage.get('game_history', []);
    const highScores = storage.getHighScores();
    
    // Calculate statistics from game history
    const totalGames = gameHistory.length;
    const gamesWon = gameHistory.filter(game => game.won).length;
    const totalAccuracy = gameHistory.reduce((sum, game) => sum + (game.accuracy || 0), 0);
    
    // Total games
    const totalGamesElement = document.getElementById('total-games');
    if (totalGamesElement) {
      totalGamesElement.textContent = totalGames.toString();
    }
    
    // Win rate
    const winRateElement = document.getElementById('win-rate');
    if (winRateElement) {
      const winRate = totalGames > 0 ? (gamesWon / totalGames * 100) : 0;
      winRateElement.textContent = `${Math.round(winRate)}%`;
    }
    
    // Best score
    const bestScoreElement = document.getElementById('best-score');
    if (bestScoreElement) {
      const bestScore = highScores.length > 0 ? highScores[0].score : 0;
      bestScoreElement.textContent = bestScore.toString();
    }
    
    // Average accuracy
    const avgAccuracyElement = document.getElementById('avg-accuracy');
    if (avgAccuracyElement) {
      const avgAccuracy = totalGames > 0 ? totalAccuracy / totalGames : 0;
      avgAccuracyElement.textContent = `${Math.round(avgAccuracy)}%`;
    }
    
    console.log('📈 Statistics updated:', {
      totalGames,
      winRate: `${Math.round((gamesWon / totalGames * 100) || 0)}%`,
      bestScore: highScores.length > 0 ? highScores[0].score : 0,
      avgAccuracy: `${Math.round((totalAccuracy / totalGames) || 0)}%`
    });
    
  } catch (error) {
    console.error('❌ Failed to update statistics:', error);
    
    // Set default values on error
    const elements = {
      'total-games': '0',
      'win-rate': '0%',
      'best-score': '0',
      'avg-accuracy': '0%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }
}

/**
 * Create and show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, warning, error, info)
 * @param {number} duration - Display duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    max-width: 300px;
    animation: slideInRight 0.3s ease-out;
    font-weight: 500;
  `;
  
  // Add animation styles if not already added
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .toast-icon {
        font-size: 16px;
      }
      
      .toast-message {
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
}

/**
 * Get toast background color based on type
 * @private
 */
function getToastColor(type) {
  const colors = {
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8'
  };
  return colors[type] || colors.info;
}

/**
 * Show achievement notification
 * @param {string} achievement - Achievement name
 * @param {string} description - Achievement description
 */
export function showAchievement(achievement, description) {
  const achievementEl = document.createElement('div');
  achievementEl.className = 'achievement-notification';
  
  achievementEl.innerHTML = `
    <div class="achievement-content">
      <div class="achievement-icon">🏆</div>
      <div class="achievement-text">
        <div class="achievement-title">Achievement Unlocked!</div>
        <div class="achievement-name">${achievement}</div>
        <div class="achievement-desc">${description}</div>
      </div>
    </div>
  `;
  
  achievementEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ffd700, #ffed4a);
    color: #333;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    max-width: 400px;
    text-align: center;
    animation: achievementPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  // Add animation styles
  if (!document.querySelector('#achievement-styles')) {
    const style = document.createElement('style');
    style.id = 'achievement-styles';
    style.textContent = `
      @keyframes achievementPop {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      
      .achievement-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .achievement-icon {
        font-size: 48px;
      }
      
      .achievement-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 4px;
      }
      
      .achievement-name {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 4px;
      }
      
      .achievement-desc {
        font-size: 12px;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(achievementEl);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    achievementEl.style.animation = 'achievementPop 0.3s reverse';
    setTimeout(() => {
      if (achievementEl.parentElement) {
        achievementEl.remove();
      }
    }, 300);
  }, 4000);
}
