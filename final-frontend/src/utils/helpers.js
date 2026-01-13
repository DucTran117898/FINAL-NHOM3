/**
 * Utility Functions for Vue.js
 */

// Local Storage utilities
export const StorageUtils = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },

  get: (key, defaultValue = null) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  },

  remove: (key) => {
    localStorage.removeItem(key)
  },

  clear: () => {
    localStorage.clear()
  },
}

// Alert utilities
export const AlertUtils = {
  success: (message, duration = 3000) => {
    showAlert(message, 'success', duration)
  },

  error: (message, duration = 3000) => {
    showAlert(message, 'danger', duration)
  },

  warning: (message, duration = 3000) => {
    showAlert(message, 'warning', duration)
  },

  info: (message, duration = 3000) => {
    showAlert(message, 'info', duration)
  },
}

/**
 * Show alert message
 */
function showAlert(message, type = 'success', duration = 3000) {
  const alertContainer = document.getElementById('alertContainer') || createAlertContainer()

  const alert = document.createElement('div')
  alert.className = `alert alert-${type} animate-slide-in`
  alert.innerHTML = `
    <span>${message}</span>
    <span class="alert-close">&times;</span>
  `

  alertContainer.appendChild(alert)

  const closeBtn = alert.querySelector('.alert-close')
  closeBtn.addEventListener('click', () => alert.remove())

  if (duration > 0) {
    setTimeout(() => alert.remove(), duration)
  }
}

/**
 * Create alert container if it doesn't exist
 */
function createAlertContainer() {
  const container = document.createElement('div')
  container.id = 'alertContainer'
  container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;'
  document.body.appendChild(container)
  return container
}

