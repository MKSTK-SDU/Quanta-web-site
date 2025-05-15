/**
 * Quanta - Physics Education Platform
 * Main JavaScript functionality
 */

// Current user state (would normally be set after login)
let currentUser = null;

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('theme-toggle');

/**
 * Initialize the application
 */
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Check theme preference
    checkThemePreference();
    
    // Check authentication status
    checkAuthStatus();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            event.target !== mobileMenuBtn) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

/**
 * Check user's theme preference and apply it
 */
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            if (themeToggle) themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            if (themeToggle) themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        if (themeToggle) themeToggle.textContent = '🌙';
    } else {
        localStorage.setItem('theme', 'light');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

/**
 * Check authentication status
 */
function checkAuthStatus() {
    // In a real app, this would verify a token or session
    // For this demo, we'll check localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        currentUser = user;
        updateUIForAuthenticatedUser(user);
    } else {
        updateUIForUnauthenticatedUser();
    }
}

/**
 * Update UI for authenticated users
 * @param {Object} user - User object
 */
function updateUIForAuthenticatedUser(user) {
    const userControls = document.querySelector('.user-controls');
    const mobileMenuList = document.querySelector('#mobile-menu ul');
    
    if (userControls) {
        // Remove login button if it exists
        const loginBtn = userControls.querySelector('.btn-primary');
        if (loginBtn) {
            loginBtn.remove();
        }
        
        // Add user menu
        const userMenuHTML = `
            <div class="user-menu">
                <a href="pages/profile.html" class="user-menu-toggle">
                    <span class="user-avatar">${getInitials(user.username)}</span>
                    <span class="user-name">${user.username}</span>
                </a>
            </div>
        `;
        
        userControls.insertAdjacentHTML('afterbegin', userMenuHTML);
    }
    
    // Update mobile menu
    if (mobileMenuList) {
        // Remove login link if it exists
        const loginLink = Array.from(mobileMenuList.querySelectorAll('li'))
            .find(li => li.querySelector('a')?.textContent === 'Login');
        
        if (loginLink) {
            loginLink.remove();
        }
        
        // Add profile and logout links if they don't exist
        if (!mobileMenuList.querySelector('a[href="pages/profile.html"]')) {
            mobileMenuList.insertAdjacentHTML('beforeend', `
                <li><a href="pages/profile.html">Profile</a></li>
                <li><a href="#" id="mobile-logout">Logout</a></li>
            `);
            
            // Add logout event listener
            const mobileLogout = document.getElementById('mobile-logout');
            if (mobileLogout) {
                mobileLogout.addEventListener('click', logout);
            }
        }
    }
}

/**
 * Update UI for unauthenticated users
 */
function updateUIForUnauthenticatedUser() {
    // This function would reset the UI to the default state for logged out users
    // This is already our default state, so no changes needed for this demo
}

/**
 * Logout the current user
 */
function logout(event) {
    if (event) event.preventDefault();
    
    // Clear user data
    localStorage.removeItem('user');
    currentUser = null;
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Render resource cards
 * @param {Array} resources - Array of resource objects
 * @param {string} containerId - ID of container element
 */
function renderResources(resources, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (resources.length === 0) {
        container.innerHTML = '<div class="no-results">No resources found matching your criteria.</div>';
        return;
    }
    
    resources.forEach(resource => {
        const resourceElement = document.createElement('div');
        resourceElement.className = 'resource-card';
        
        // Map resource type to icon
        let typeIcon = '📄'; // Default
        switch (resource.type) {
            case 'book': typeIcon = '📚'; break;
            case 'video': typeIcon = '🎬'; break;
            case 'simulation': typeIcon = '🔬'; break;
            case 'article': typeIcon = '📄'; break;
            case 'problem-set': typeIcon = '📝'; break;
        }
        
        resourceElement.innerHTML = `
            <div class="resource-image">
                <span>${typeIcon} ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
            </div>
            <div class="resource-content">
                <span class="resource-category">${resource.category}</span>
                <h3 class="resource-title">${resource.title}</h3>
                <p>${truncateText(resource.description, 80)}</p>
                <div class="resource-meta">
                    <span>⭐ ${resource.rating.toFixed(1)}</span>
                    <span>👁️ ${formatNumber(resource.views)}</span>
                    <span>Updated ${formatDate(resource.updatedAt)}</span>
                </div>
            </div>
        `;
        
        resourceElement.addEventListener('click', () => {
            window.location.href = 'pages/library.html';
        });
        
        container.appendChild(resourceElement);
    });
}

/**
 * Render discussion cards
 * @param {Array} discussions - Array of discussion objects
 * @param {string} containerId - ID of container element
 */
function renderDiscussions(discussions, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (discussions.length === 0) {
        container.innerHTML = '<div class="no-results">No discussions found matching your criteria.</div>';
        return;
    }
    
    discussions.forEach(discussion => {
        const discussionElement = document.createElement('div');
        discussionElement.className = 'discussion-card';
        
        let tagsHTML = '';
        discussion.tags.forEach(tag => {
            tagsHTML += `<span class="discussion-tag">${tag}</span>`;
        });
        
        discussionElement.innerHTML = `
            <div class="discussion-header">
                <div class="discussion-info">
                    <h3 class="discussion-title">${discussion.title}</h3>
                    <div class="discussion-tags">
                        ${tagsHTML}
                        ${discussion.isSolved ? 
                          '<span class="discussion-tag" style="background-color: var(--success-light); color: var(--success-color);">Solved</span>' : 
                          ''}
                        ${discussion.user.isExpert ? 
                          '<span class="discussion-tag" style="background-color: var(--primary-light); color: var(--primary-dark);">Expert</span>' : 
                          ''}
                    </div>
                    <div class="discussion-meta">
                        <span>By ${discussion.user.username}</span>
                        <span>👁️ ${discussion.views} views</span>
                        <span>Posted ${formatDate(discussion.createdAt)}</span>
                    </div>
                </div>
                <div class="discussion-votes">
                    <button class="vote-btn vote-up">▲</button>
                    <span class="vote-count">${discussion.upvotes - discussion.downvotes}</span>
                    <button class="vote-btn vote-down">▼</button>
                </div>
            </div>
            <p>${truncateText(discussion.content, 150)}</p>
        `;
        
        // Add event listeners for vote buttons
        const upvoteBtn = discussionElement.querySelector('.vote-up');
        const downvoteBtn = discussionElement.querySelector('.vote-down');
        
        if (upvoteBtn) {
            upvoteBtn.addEventListener('click', () => handleVote(discussion.id, 'up'));
        }
        
        if (downvoteBtn) {
            downvoteBtn.addEventListener('click', () => handleVote(discussion.id, 'down'));
        }
        
        container.appendChild(discussionElement);
    });
}

/**
 * Handle voting on a discussion
 * @param {number} discussionId - ID of the discussion
 * @param {string} direction - 'up' or 'down'
 */
function handleVote(discussionId, direction) {
    // In a real app, this would send a request to the server
    if (!currentUser) {
        alert('Please log in to vote on discussions.');
        return;
    }
    
    alert(`You voted ${direction} on discussion ${discussionId}`);
}

/**
 * Format a number with thousands separators
 * @param {number} number - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);