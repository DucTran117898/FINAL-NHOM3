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
        window.location.href = '/login.html';
    }
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
        const user = await authService.getCurrentUser();
        updateUserDisplay(user);
    } catch (error) {
        console.error('Failed to get current user:', error);
    }
}

/**
 * Update user display information
 */
function updateUserDisplay(user) {
    if (user) {
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar && user.name) {
            const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            userAvatar.textContent = initials;
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
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout error:', error);
        apiClient.setToken(null);
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    }
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    const token = apiClient.getToken();
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}
