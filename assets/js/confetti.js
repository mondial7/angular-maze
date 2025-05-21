/**
 * Simple confetti animation for maze completion
 */
const MazeConfetti = {
  colors: ['#123361', '#F72585', '#4CC9F0', '#3f6eac', '#FFBE0B'],
  
  // Create confetti elements
  createElements: function(count) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'confetti-item';
      element.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      element.style.left = Math.random() * 100 + 'vw';
      element.style.animationDelay = Math.random() * 3 + 's';
      element.style.animationDuration = Math.random() * 2 + 3 + 's';
      container.appendChild(element);
    }
    
    return container;
  },
  
  // Start the confetti animation
  start: function() {
    const container = this.createElements(100);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      document.body.removeChild(container);
    }, 6000);
  }
};

/**
 * Toast notification system
 */
const MazeToast = {
  // Create and show a toast notification
  show: function(title, message, type = 'success', duration = 5000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    // Add title if provided
    if (title) {
      const titleElement = document.createElement('h4');
      titleElement.className = 'toast-title';
      titleElement.textContent = title;
      toast.appendChild(titleElement);
    }
    
    // Add message
    const messageElement = document.createElement('p');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    toast.appendChild(messageElement);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      this.hide(toast);
    });
    toast.appendChild(closeButton);
    
    // Add to container
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto-hide after duration
    if (duration) {
      setTimeout(() => {
        this.hide(toast);
      }, duration);
    }
    
    return toast;
  },
  
  // Hide a toast notification
  hide: function(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    // Remove after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
};
