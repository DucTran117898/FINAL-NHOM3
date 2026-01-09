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
        if (loginTimeDisplay && user.login_time) {
            loginTimeDisplay.textContent = user.login_time;
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
