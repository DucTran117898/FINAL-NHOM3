/**
 * Main Application Script
 * Handles routing, navigation, and global app logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkAuthentication();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token && !window.location.pathname.includes('login')) {
        window.location.href = getLoginUrl();
    }
}

function getLoginUrl() {
    return window.location.pathname.includes('/subjects/') ? '../login.html' : 'login.html';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation menu
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/**
 * Check authentication status
 */
async function checkAuthentication() {
    const token = apiClient.getToken();
    if (!token) return;

    try {
        // Try to get user from localStorage first
        let user = StorageUtils.get('user');
        if (user) {
            updateUserDisplay(user);
        }

        // Then try to get from API
        const apiUser = await authService.getCurrentUser();
        if (apiUser && apiUser.user) {
            StorageUtils.set('user', apiUser.user);
            updateUserDisplay(apiUser.user);
        }
    } catch (error) {
        console.error('Failed to get current user:', error);
        // Show default user display
        updateUserDisplay(StorageUtils.get('user'));
    }
}

/**
 * Update user display information
 */
function updateUserDisplay(user) {
    if (user) {
        // Update avatar
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            const displayName = user.login_id || user.name || 'User';
            const initials = displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            userAvatar.textContent = initials;
            userAvatar.title = displayName;
        }

        // Update login info display
        const loginIdDisplay = document.getElementById('loginIdDisplay');
        if (loginIdDisplay && user.login_id) {
            loginIdDisplay.textContent = user.login_id;
        }

        const roleDisplay = document.getElementById('roleDisplay');
        if (roleDisplay && user.role) {
            roleDisplay.textContent = user.role;
        }

        const loginTimeDisplay = document.getElementById('loginTimeDisplay');
        if (loginTimeDisplay) {
            if (user.login_time) {
                // Format login time as Y-m-d H:i
                const loginTime = formatLoginTime(user.login_time);
                loginTimeDisplay.textContent = loginTime;
            } else {
                // If no login_time, use current time
                const now = new Date();
                const formattedTime = formatDateToYmdHi(now);
                loginTimeDisplay.textContent = formattedTime;
            }
        }
    }
}

/**
 * Handle logout
 */
async function handleLogout() {
    try {
        await authService.logout();
        apiClient.setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = getLoginUrl();
    } catch (error) {
        console.error('Logout error:', error);
        apiClient.setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = getLoginUrl();
    }
}

/**
 * Format login time to Y-m-d H:i format
 */
function formatLoginTime(timeString) {
    if (!timeString) return '-';
    
    try {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) {
            // If it's already in Y-m-d H:i format, return as is
            return timeString;
        }
        return formatDateToYmdHi(date);
    } catch (error) {
        return timeString;
    }
}

/**
 * Format date to Y-m-d H:i format
 */
function formatDateToYmdHi(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    const token = apiClient.getToken();
    if (!token) {
        window.location.href = getLoginUrl();
        return false;
    }
    return true;
}
