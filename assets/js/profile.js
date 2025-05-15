/**
 * Quanta - Physics Education Platform
 * Profile Page JavaScript
 */

// Global variables
let currentUser = null;
let currentUserProgress = [];
let activeTab = 'overview';

// DOM Elements
let userNameEl;
let userAvatarEl;
let userStatusEl;
let tabsEl;
let tabContentsEl;
let editProfileFormEl;
let editProfileBtnEl;
let saveProfileBtnEl;
let cancelEditBtnEl;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    userNameEl = document.getElementById('user-name');
    userAvatarEl = document.getElementById('user-avatar');
    userStatusEl = document.getElementById('user-status');
    tabsEl = document.querySelectorAll('.tab');
    tabContentsEl = document.querySelectorAll('.tab-content');
    editProfileFormEl = document.getElementById('edit-profile-form');
    editProfileBtnEl = document.getElementById('edit-profile-btn');
    saveProfileBtnEl = document.getElementById('save-profile-btn');
    cancelEditBtnEl = document.getElementById('cancel-edit-btn');
    
    // Add event listeners
    if (tabsEl) {
        tabsEl.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
            });
        });
    }
    
    if (editProfileBtnEl) {
        editProfileBtnEl.addEventListener('click', toggleEditMode);
    }
    
    if (saveProfileBtnEl) {
        saveProfileBtnEl.addEventListener('click', saveProfile);
    }
    
    if (cancelEditBtnEl) {
        cancelEditBtnEl.addEventListener('click', cancelEdit);
    }
    
    if (editProfileFormEl) {
        editProfileFormEl.addEventListener('submit', handleProfileUpdate);
    }
    
    // Check if user is logged in
    currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html?redirect=profile.html';
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Load user progress
    loadUserProgress();
    
    // Initialize LaTeX rendering
    if (window.latex) {
        window.latex.initLatexRendering();
    }
});

// Load user data from API
async function loadUserData() {
    try {
        if (!currentUser) return;
        
        // Update user information in the UI
        if (userNameEl) {
            userNameEl.textContent = currentUser.username;
        }
        
        if (userAvatarEl) {
            userAvatarEl.textContent = getInitials(currentUser.username);
        }
        
        // Set status badge
        if (userStatusEl) {
            userStatusEl.textContent = currentUser.isExpert ? 'Expert' : 'Student';
        }
        
        // Fetch additional user data
        const response = await fetch(`/api/users/${currentUser.id}`);
        
        if (!response.ok) {
            throw new Error('Failed to load user data');
        }
        
        const userData = await response.json();
        
        // Update user object with additional data
        currentUser = { ...currentUser, ...userData };
        
        // Update profile form if it exists
        populateProfileForm();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showToast('Failed to load user profile data', 'error');
    }
}

// Load user progress from API
async function loadUserProgress() {
    try {
        if (!currentUser) return;
        
        // Fetch user progress
        const response = await fetch(`/api/users/${currentUser.id}/progress`);
        
        if (!response.ok) {
            throw new Error('Failed to load user progress');
        }
        
        const progress = await response.json();
        currentUserProgress = progress;
        
        // Update progress charts and statistics
        updateProgressCharts();
        updateStatistics();
        
    } catch (error) {
        console.error('Error loading user progress:', error);
        showToast('Failed to load progress data', 'error');
    }
}

// Switch between tabs
function switchTab(tabId) {
    if (!tabId) return;
    
    // Update active tab
    activeTab = tabId;
    
    // Update tab UI
    tabsEl.forEach(tab => {
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update tab content
    tabContentsEl.forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Refresh content based on active tab
    switch (tabId) {
        case 'progress':
            updateProgressCharts();
            break;
        case 'activities':
            loadActivities();
            break;
        case 'resources':
            loadSavedResources();
            break;
        case 'settings':
            populateProfileForm();
            break;
    }
}

// Update progress charts
function updateProgressCharts() {
    const progressContainer = document.getElementById('progress-charts');
    if (!progressContainer) return;
    
    // Group progress by topic
    const topicProgress = {};
    
    currentUserProgress.forEach(progress => {
        if (!topicProgress[progress.topic]) {
            topicProgress[progress.topic] = {
                correct: 0,
                total: 0
            };
        }
        
        topicProgress[progress.topic].correct += progress.correct;
        topicProgress[progress.topic].total += progress.total;
    });
    
    // Create progress bars for each topic
    let progressHTML = '';
    
    if (Object.keys(topicProgress).length === 0) {
        progressHTML = '<div class="no-data">No progress data available yet. Complete some exams to see your progress!</div>';
    } else {
        for (const [topic, data] of Object.entries(topicProgress)) {
            const percentage = Math.round((data.correct / data.total) * 100);
            
            progressHTML += `
                <div class="topic-progress">
                    <div class="topic-label">${topic}</div>
                    <div class="topic-bar">
                        <div class="topic-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="topic-percentage">${percentage}%</div>
                </div>
            `;
        }
    }
    
    progressContainer.innerHTML = progressHTML;
}

// Update statistics
function updateStatistics() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    // Calculate statistics
    let totalExams = 0;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let topicsStudied = new Set();
    
    currentUserProgress.forEach(progress => {
        totalExams++;
        totalQuestions += progress.total;
        correctAnswers += progress.correct;
        topicsStudied.add(progress.topic);
    });
    
    const avgScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Update statistics HTML
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalExams}</div>
                <div class="stat-label">Exams Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgScore}%</div>
                <div class="stat-label">Avg. Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalQuestions}</div>
                <div class="stat-label">Questions Answered</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${topicsStudied.size}</div>
                <div class="stat-label">Topics Studied</div>
            </div>
        </div>
    `;
}

// Load user activities
function loadActivities() {
    const activitiesContainer = document.getElementById('activities-list');
    if (!activitiesContainer) return;
    
    // For demo purposes, we'll just create some placeholder activities
    // In a real app, this would be fetched from an API
    
    // Create sample activities based on user progress
    const activities = [];
    
    // Add exam activities
    currentUserProgress.forEach(progress => {
        activities.push({
            type: 'exam',
            topic: progress.topic,
            score: Math.round((progress.correct / progress.total) * 100),
            date: progress.createdAt || new Date()
        });
    });
    
    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<div class="no-data">No activity data available yet.</div>';
        return;
    }
    
    // Create activity items
    let activitiesHTML = '';
    
    activities.forEach(activity => {
        let icon = '📝';
        let title = '';
        let description = '';
        
        if (activity.type === 'exam') {
            icon = '📝';
            title = `Completed ${activity.topic} Exam`;
            description = `Scored ${activity.score}% on this exam`;
        }
        
        activitiesHTML += `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-details">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
                <div class="activity-date">${formatDate(activity.date)}</div>
            </div>
        `;
    });
    
    activitiesContainer.innerHTML = activitiesHTML;
}

// Load saved resources
function loadSavedResources() {
    const resourcesContainer = document.getElementById('saved-resources');
    if (!resourcesContainer) return;
    
    // This would fetch saved resources from the API in a production app
    // For now, we'll just display a message
    resourcesContainer.innerHTML = '<div class="no-data">Saved resources feature is not implemented in this demo.</div>';
}

// Toggle edit profile mode
function toggleEditMode() {
    if (!editProfileFormEl) return;
    
    editProfileFormEl.style.display = 'block';
    
    if (editProfileBtnEl) {
        editProfileBtnEl.style.display = 'none';
    }
    
    // Populate form with user data
    populateProfileForm();
}

// Cancel edit profile
function cancelEdit() {
    if (!editProfileFormEl) return;
    
    editProfileFormEl.style.display = 'none';
    
    if (editProfileBtnEl) {
        editProfileBtnEl.style.display = 'block';
    }
}

// Populate profile form with user data
function populateProfileForm() {
    if (!editProfileFormEl || !currentUser) return;
    
    const usernameInput = editProfileFormEl.querySelector('#profile-username');
    const emailInput = editProfileFormEl.querySelector('#profile-email');
    const bioInput = editProfileFormEl.querySelector('#profile-bio');
    
    if (usernameInput) {
        usernameInput.value = currentUser.username || '';
    }
    
    if (emailInput) {
        emailInput.value = currentUser.email || '';
    }
    
    if (bioInput) {
        bioInput.value = currentUser.bio || '';
    }
}

// Handle profile update form submission
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const form = e.target;
    const usernameInput = form.querySelector('#profile-username');
    const emailInput = form.querySelector('#profile-email');
    const bioInput = form.querySelector('#profile-bio');
    const errorEl = form.querySelector('.error-message');
    
    // Basic validation
    if (!usernameInput.value.trim()) {
        showFormError(errorEl, 'Username cannot be empty');
        return;
    }
    
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showFormError(errorEl, 'Please enter a valid email address');
        return;
    }
    
    try {
        // Create updated profile data
        const updatedProfile = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            bio: bioInput.value.trim()
        };
        
        // Send update request
        const response = await fetch(`/api/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProfile)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        const updatedUser = await response.json();
        
        // Update current user object
        currentUser = { ...currentUser, ...updatedUser };
        
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Update UI
        loadUserData();
        
        // Hide edit form
        cancelEdit();
        
        // Show success message
        showToast('Profile updated successfully', 'success');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showFormError(errorEl, error.message || 'Failed to update profile');
    }
}

// Save profile changes
function saveProfile() {
    if (!editProfileFormEl) return;
    
    // Trigger form submission
    const submitEvent = new Event('submit', { cancelable: true });
    editProfileFormEl.dispatchEvent(submitEvent);
}

// Show an error message on a form
function showFormError(errorEl, message) {
    if (!errorEl) return;
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}