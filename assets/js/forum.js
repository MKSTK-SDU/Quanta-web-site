/**
 * Quanta - Physics Education Platform
 * Forum Page JavaScript
 */

// Global variables
let currentDiscussions = [];
let currentPage = 1;
let pageSize = 10;
let totalPages = 0;
let currentFilters = {
    tag: '',
    search: '',
    solved: null,
    sort: 'recent'
};

// DOM Elements
let discussionListEl;
let searchInputEl;
let tagFilterEl;
let solvedFilterEl;
let sortFilterEl;
let paginationEl;
let createFormEl;
let createBtnEl;

// Initialize forum page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    discussionListEl = document.getElementById('discussion-list');
    searchInputEl = document.getElementById('search-input');
    tagFilterEl = document.getElementById('tag-filter');
    solvedFilterEl = document.getElementById('solved-filter');
    sortFilterEl = document.getElementById('sort-filter');
    paginationEl = document.getElementById('pagination');
    createFormEl = document.getElementById('create-discussion-form');
    createBtnEl = document.getElementById('create-discussion-btn');
    
    // Add event listeners
    if (searchInputEl) {
        searchInputEl.addEventListener('input', debounce(handleSearchChange, 500));
    }
    
    if (tagFilterEl) {
        tagFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (solvedFilterEl) {
        solvedFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (sortFilterEl) {
        sortFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (createBtnEl) {
        createBtnEl.addEventListener('click', toggleCreateForm);
    }
    
    if (createFormEl) {
        createFormEl.addEventListener('submit', handleCreateDiscussion);
    }
    
    // Set up tag selector if present
    setupTagSelector();
    
    // Initialize LaTeX rendering
    if (window.latex) {
        window.latex.initLatexRendering();
    }
    
    // Load discussions
    loadDiscussions();
});

// Load discussions from API
async function loadDiscussions() {
    try {
        // Show loading state
        if (discussionListEl) {
            discussionListEl.innerHTML = '<div class="loading">Loading discussions...</div>';
        }
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (currentFilters.tag) {
            queryParams.append('tag', currentFilters.tag);
        }
        
        if (currentFilters.search) {
            queryParams.append('search', currentFilters.search);
        }
        
        if (currentFilters.solved !== null) {
            queryParams.append('solved', currentFilters.solved);
        }
        
        if (currentFilters.sort) {
            queryParams.append('sort', currentFilters.sort);
        }
        
        // Fetch discussions from API
        const response = await fetch(`/api/discussions?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load discussions');
        }
        
        const discussions = await response.json();
        currentDiscussions = discussions;
        
        // Calculate pagination
        totalPages = Math.ceil(discussions.length / pageSize);
        
        // Display discussions
        displayDiscussions();
        updatePagination();
        
    } catch (error) {
        console.error('Error loading discussions:', error);
        
        if (discussionListEl) {
            discussionListEl.innerHTML = `
                <div class="error-message">
                    <p>Failed to load discussions. Please try again later.</p>
                    <button class="btn btn-primary" onclick="loadDiscussions()">Retry</button>
                </div>
            `;
        }
    }
}

// Display discussions with pagination
function displayDiscussions() {
    if (!discussionListEl) return;
    
    // Clear previous discussions
    discussionListEl.innerHTML = '';
    
    // Get current page discussions
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageDiscussions = currentDiscussions.slice(startIndex, endIndex);
    
    // Check if there are no discussions
    if (pageDiscussions.length === 0) {
        discussionListEl.innerHTML = `
            <div class="no-results">
                <p>No discussions found. Be the first to start a conversation!</p>
                <button class="btn btn-primary" onclick="toggleCreateForm()">Create Discussion</button>
            </div>
        `;
        return;
    }
    
    // Create discussion cards
    pageDiscussions.forEach(discussion => {
        const card = createDiscussionCard(discussion);
        discussionListEl.appendChild(card);
    });
    
    // Initialize LaTeX for the newly added content
    if (window.latex) {
        window.latex.initLatexRendering();
    }
}

// Create a discussion card
function createDiscussionCard(discussion) {
    // Create tags HTML
    const tagsHtml = discussion.tags.map(tag => `<span class="discussion-tag">${tag}</span>`).join('');
    
    // Create card element from template
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="discussion-item" data-id="${discussion.id}">
            <div class="discussion-header">
                <div class="discussion-info">
                    <h3 class="discussion-title">${discussion.title}</h3>
                    <div class="discussion-meta">
                        <span>By ${discussion.authorName}</span>
                        <span>Posted ${formatDate(discussion.createdAt)}</span>
                        <span>${discussion.commentCount || 0} replies</span>
                    </div>
                    <div class="discussion-tags">
                        ${tagsHtml}
                    </div>
                </div>
                <div class="discussion-votes">
                    <button class="vote-btn upvote" data-id="${discussion.id}">▲</button>
                    <span class="vote-count">${discussion.votes}</span>
                    <button class="vote-btn downvote" data-id="${discussion.id}">▼</button>
                </div>
            </div>
            <div class="discussion-preview">
                ${truncateText(discussion.content, 200)}
            </div>
            <div class="discussion-actions">
                <a href="#" class="discussion-action-link view-discussion" data-id="${discussion.id}">
                    Read More
                </a>
                <div>
                    ${discussion.solved ? '<span class="discussion-tag">✓ Solved</span>' : ''}
                </div>
            </div>
        </div>
    `.trim();
    
    const card = template.content.firstChild;
    
    // Add click events for voting
    card.querySelector('.upvote').addEventListener('click', (e) => {
        e.stopPropagation();
        voteOnDiscussion(discussion.id, 'up');
    });
    
    card.querySelector('.downvote').addEventListener('click', (e) => {
        e.stopPropagation();
        voteOnDiscussion(discussion.id, 'down');
    });
    
    // Add click event to view discussion
    card.querySelector('.view-discussion').addEventListener('click', (e) => {
        e.preventDefault();
        showDiscussionDetails(discussion.id);
    });
    
    return card;
}

// Update pagination controls
function updatePagination() {
    if (!paginationEl) return;
    
    // Clear previous pagination
    paginationEl.innerHTML = '';
    
    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return;
    }
    
    // Create pagination controls
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('div');
        pageItem.className = `pagination-item ${i === currentPage ? 'active' : ''}`;
        pageItem.textContent = i;
        pageItem.addEventListener('click', () => {
            currentPage = i;
            displayDiscussions();
            updatePagination();
            // Scroll back to the top of the list
            discussionListEl.scrollIntoView({ behavior: 'smooth' });
        });
        
        paginationEl.appendChild(pageItem);
    }
}

// Handle search input change
function handleSearchChange() {
    if (!searchInputEl) return;
    
    currentFilters.search = searchInputEl.value.trim();
    currentPage = 1; // Reset to first page
    loadDiscussions();
}

// Handle filter changes
function handleFilterChange() {
    if (tagFilterEl) {
        currentFilters.tag = tagFilterEl.value;
    }
    
    if (solvedFilterEl) {
        const solvedValue = solvedFilterEl.value;
        currentFilters.solved = solvedValue === 'all' 
            ? null 
            : (solvedValue === 'solved');
    }
    
    if (sortFilterEl) {
        currentFilters.sort = sortFilterEl.value;
    }
    
    currentPage = 1; // Reset to first page
    loadDiscussions();
}

// Toggle create discussion form
function toggleCreateForm() {
    if (!createFormEl) return;
    
    const isVisible = createFormEl.style.display === 'block';
    
    if (isVisible) {
        createFormEl.style.display = 'none';
    } else {
        createFormEl.style.display = 'block';
        createFormEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle discussion creation
async function handleCreateDiscussion(e) {
    e.preventDefault();
    
    const form = e.target;
    const titleInput = form.querySelector('#discussion-title');
    const contentInput = form.querySelector('#discussion-content');
    const errorEl = form.querySelector('.error-message');
    
    // Basic validation
    if (!titleInput.value.trim()) {
        errorEl.textContent = 'Please enter a title';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!contentInput.value.trim()) {
        errorEl.textContent = 'Please enter some content';
        errorEl.style.display = 'block';
        return;
    }
    
    // Get selected tags
    const selectedTags = [];
    const tagOptions = form.querySelectorAll('.tag-option.selected');
    tagOptions.forEach(tag => {
        selectedTags.push(tag.dataset.tag);
    });
    
    // Get current user
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!currentUser) {
        errorEl.textContent = 'You must be logged in to create a discussion';
        errorEl.style.display = 'block';
        return;
    }
    
    // Create discussion data
    const discussion = {
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        tags: selectedTags,
        authorId: currentUser.id,
        authorName: currentUser.username
    };
    
    try {
        // Disable form and show loading state
        form.querySelectorAll('input, textarea, button').forEach(el => {
            el.disabled = true;
        });
        
        // Send request to create discussion
        const response = await fetch('/api/discussions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discussion)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create discussion');
        }
        
        // Reset form
        form.reset();
        form.style.display = 'none';
        
        // Reload discussions to show the new one
        currentPage = 1;
        loadDiscussions();
        
        // Show success message
        showToast('Discussion created successfully', 'success');
        
    } catch (error) {
        console.error('Error creating discussion:', error);
        errorEl.textContent = 'Failed to create discussion. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        // Enable form inputs
        form.querySelectorAll('input, textarea, button').forEach(el => {
            el.disabled = false;
        });
    }
}

// Vote on a discussion
async function voteOnDiscussion(discussionId, vote) {
    // Get current user
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!currentUser) {
        showToast('You must be logged in to vote', 'error');
        return;
    }
    
    try {
        // Send vote request
        const response = await fetch(`/api/discussions/${discussionId}/vote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vote: vote === 'up' ? 'up' : 'down' })
        });
        
        if (!response.ok) {
            throw new Error('Failed to vote');
        }
        
        const updatedDiscussion = await response.json();
        
        // Update the vote count in the UI
        const voteCountEl = document.querySelector(`.discussion-item[data-id="${discussionId}"] .vote-count`);
        if (voteCountEl) {
            voteCountEl.textContent = updatedDiscussion.votes;
        }
        
        // Update the discussion in our current list
        const index = currentDiscussions.findIndex(d => d.id === discussionId);
        if (index !== -1) {
            currentDiscussions[index].votes = updatedDiscussion.votes;
        }
        
    } catch (error) {
        console.error('Error voting on discussion:', error);
        showToast('Failed to register vote', 'error');
    }
}

// Show discussion details
async function showDiscussionDetails(discussionId) {
    // This would navigate to the discussion detail page
    // For now, we'll just use an alert as a placeholder
    alert(`Viewing discussion details for ID: ${discussionId}`);
    
    // In a real implementation, you would:
    // 1. Fetch the full discussion with comments
    // 2. Navigate to a detail page or show a modal
    // window.location.href = `discussion.html?id=${discussionId}`;
}

// Set up tag selector
function setupTagSelector() {
    const tagSelector = document.querySelector('.tag-selector');
    
    if (!tagSelector) return;
    
    // Add click event to each tag option
    const tagOptions = tagSelector.querySelectorAll('.tag-option');
    
    tagOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
        });
    });
}

// Show a toast notification
function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}