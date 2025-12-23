/**
 * Utility Functions
 */

// DOM utilities
const DOM = {
    getElementById: (id) => document.getElementById(id),
    querySelector: (selector) => document.querySelector(selector),
    querySelectorAll: (selector) => document.querySelectorAll(selector),

    show: (element) => {
        if (element) element.style.display = '';
    },

    hide: (element) => {
        if (element) element.style.display = 'none';
    },

    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },

    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },

    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },

    hasClass: (element, className) => {
        return element && element.classList.contains(className);
    },

    on: (element, event, handler) => {
        if (element) element.addEventListener(event, handler);
    },

    off: (element, event, handler) => {
        if (element) element.removeEventListener(event, handler);
    },

    delegate: (parent, selector, event, handler) => {
        parent.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target) handler.call(target, e);
        });
    },

    html: (element, content) => {
        if (element) {
            if (content !== undefined) {
                element.innerHTML = content;
            } else {
                return element.innerHTML;
            }
        }
    },

    text: (element, content) => {
        if (element) {
            if (content !== undefined) {
                element.textContent = content;
            } else {
                return element.textContent;
            }
        }
    },

    val: (element, value) => {
        if (element) {
            if (value !== undefined) {
                element.value = value;
            } else {
                return element.value;
            }
        }
    },

    attr: (element, attr, value) => {
        if (element) {
            if (value !== undefined) {
                element.setAttribute(attr, value);
            } else {
                return element.getAttribute(attr);
            }
        }
    },

    remove: (element) => {
        if (element) element.remove();
    },

    create: (tag, options = {}) => {
        const element = document.createElement(tag);
        if (options.className) element.className = options.className;
        if (options.id) element.id = options.id;
        if (options.html) element.innerHTML = options.html;
        if (options.text) element.textContent = options.text;
        if (options.attributes) {
            for (const [key, value] of Object.entries(options.attributes)) {
                element.setAttribute(key, value);
            }
        }
        return element;
    },
};

// String utilities
const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

    camelToKebab: (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(),

    slugify: (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),

    truncate: (str, length = 100, suffix = '...') => {
        if (str.length > length) {
            return str.substring(0, length).trim() + suffix;
        }
        return str;
    },

    isEmpty: (str) => !str || str.trim().length === 0,
};

// Array utilities
const ArrayUtils = {
    unique: (arr) => [...new Set(arr)],

    flatten: (arr) => arr.flat(Infinity),

    groupBy: (arr, key) => {
        return arr.reduce((acc, obj) => {
            const keyValue = obj[key];
            if (!acc[keyValue]) acc[keyValue] = [];
            acc[keyValue].push(obj);
            return acc;
        }, {});
    },

    findIndex: (arr, predicate) => arr.findIndex(predicate),

    findBy: (arr, key, value) => arr.find((item) => item[key] === value),

    mapBy: (arr, key) => arr.map((item) => item[key]),

    sum: (arr, key = null) => {
        if (key) {
            return arr.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
        }
        return arr.reduce((sum, item) => sum + (parseFloat(item) || 0), 0);
    },
};

// Number utilities
const NumberUtils = {
    formatCurrency: (amount, currency = 'VND', locale = 'vi-VN') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(amount);
    },

    formatNumber: (num, decimals = 0) => {
        return (Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)).toLocaleString();
    },

    percentage: (value, total) => {
        return total === 0 ? 0 : ((value / total) * 100).toFixed(2);
    },
};

// Date utilities
const DateUtils = {
    format: (date, format = 'DD/MM/YYYY') => {
        const d = new Date(date);
        const map = {
            DD: String(d.getDate()).padStart(2, '0'),
            MM: String(d.getMonth() + 1).padStart(2, '0'),
            YYYY: d.getFullYear(),
            YY: String(d.getFullYear()).slice(-2),
            HH: String(d.getHours()).padStart(2, '0'),
            mm: String(d.getMinutes()).padStart(2, '0'),
            ss: String(d.getSeconds()).padStart(2, '0'),
        };

        return format.replace(/DD|MM|YYYY|YY|HH|mm|ss/g, (matched) => map[matched] || matched);
    },

    parse: (dateString) => new Date(dateString),

    isToday: (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    },

    daysAgo: (date) => {
        const today = new Date();
        const diffTime = Math.abs(today - new Date(date));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
};

// Validation utilities
const ValidationUtils = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

    isPhone: (phone) => /^(\+\d{1,3}[- ]?)?\d{10,}$/.test(phone),

    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    isStrongPassword: (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    },

    isEmpty: (value) => {
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0;
        return !value || value.toString().trim().length === 0;
    },
};

// Local Storage utilities
const StorageUtils = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get: (key, defaultValue = null) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    },
};

// Session Storage utilities
const SessionUtils = {
    set: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    get: (key, defaultValue = null) => {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },

    remove: (key) => {
        sessionStorage.removeItem(key);
    },
};

// Alert utilities
const AlertUtils = {
    success: (message, duration = 3000) => {
        showAlert(message, 'success', duration);
    },

    error: (message, duration = 3000) => {
        showAlert(message, 'danger', duration);
    },

    warning: (message, duration = 3000) => {
        showAlert(message, 'warning', duration);
    },

    info: (message, duration = 3000) => {
        showAlert(message, 'info', duration);
    },
};

/**
 * Show alert message
 */
function showAlert(message, type = 'success', duration = 3000) {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} animate-slide-in`;
    alert.innerHTML = `
        <span>${message}</span>
        <span class="alert-close">&times;</span>
    `;

    alertContainer.appendChild(alert);

    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => alert.remove());

    if (duration > 0) {
        setTimeout(() => alert.remove(), duration);
    }
}

/**
 * Create alert container if it doesn't exist
 */
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    document.body.appendChild(container);
    return container;
}

/**
 * Show loading spinner
 */
function showLoading(container = '.content') {
    const element = typeof container === 'string' ? document.querySelector(container) : container;
    if (element) {
        element.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <span style="margin-left: 15px;">Đang tải dữ liệu...</span>
            </div>
        `;
    }
}

/**
 * Debounce function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
