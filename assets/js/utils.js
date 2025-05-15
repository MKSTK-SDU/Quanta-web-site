/**
 * Quanta - Physics Education Platform
 * Utility Functions
 */

/**
 * Format a date for display
 * @param {string|Date} dateInput - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateInput) {
    // Convert to Date object if it's a string
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Define time periods in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    // Format based on how recent the date is
    if (diff < minute) {
        return 'Just now';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diff < month) {
        const weeks = Math.floor(diff / week);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
}

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Generate initials from a name
 * @param {string} name - Name to generate initials from
 * @returns {string} - Initials (1-2 letters)
 */
function getInitials(name) {
    if (!name) return 'U';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
        return name.charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Create a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-friendly slug
 */
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
        .trim();                   // Trim whitespace
}

/**
 * Convert LaTeX to HTML for display
 * @param {string} text - Text that may contain LaTeX delimited by $ or $$
 * @returns {string} - HTML with rendered LaTeX (placeholder for actual implementation)
 */
function renderLatex(text) {
    // This is a placeholder function that would be implemented with a proper LaTeX rendering library
    // In a real implementation, you would use a library like KaTeX or MathJax
    
    // Simple placeholder implementation
    return text
        .replace(/\$\$(.*?)\$\$/g, '<span class="math-block">$1</span>')
        .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>');
}

/**
 * Generates a random ID
 * @returns {string} - Random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

/**
 * Format a number with separators (e.g. 1,234)
 * @param {number} number - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get browser's preferred color scheme
 * @returns {string} - 'dark' or 'light'
 */
function getPreferredColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
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
 * Validate an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Get a parameter from the URL query string
 * @param {string} name - Parameter name
 * @returns {string|null} - Parameter value or null
 */
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}