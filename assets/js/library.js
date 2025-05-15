/**
 * Quanta - Physics Education Platform
 * Library Page JavaScript
 */

// Global variables
let currentResources = [];
let currentPage = 1;
let pageSize = 12;
let totalPages = 0;
let currentFilters = {
    category: '',
    type: '',
    difficulty: '',
    search: ''
};

// DOM Elements
let resourceGridEl;
let searchInputEl;
let categoryFilterEl;
let typeFilterEl;
let difficultyFilterEl;
let paginationEl;
let resourceDetailsEl;
let uploadResourceFormEl;
let uploadResourceBtnEl;

// Initialize library page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    resourceGridEl = document.getElementById('resource-grid');
    searchInputEl = document.getElementById('search-input');
    categoryFilterEl = document.getElementById('category-filter');
    typeFilterEl = document.getElementById('type-filter');
    difficultyFilterEl = document.getElementById('difficulty-filter');
    paginationEl = document.getElementById('pagination');
    resourceDetailsEl = document.getElementById('resource-details');
    uploadResourceFormEl = document.getElementById('upload-resource-form');
    uploadResourceBtnEl = document.getElementById('upload-resource-btn');
    
    // Add event listeners
    if (searchInputEl) {
        searchInputEl.addEventListener('input', debounce(handleSearchChange, 500));
    }
    
    if (categoryFilterEl) {
        categoryFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (typeFilterEl) {
        typeFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (difficultyFilterEl) {
        difficultyFilterEl.addEventListener('change', handleFilterChange);
    }
    
    if (uploadResourceBtnEl) {
        uploadResourceBtnEl.addEventListener('click', toggleUploadForm);
    }
    
    if (uploadResourceFormEl) {
        uploadResourceFormEl.addEventListener('submit', handleResourceUpload);
    }
    
    // Initialize LaTeX rendering
    if (window.latex) {
        window.latex.initLatexRendering();
    }
    
    // Load resources
    loadResources();
});

// Load resources from API
async function loadResources() {
    try {
        // Show loading state
        if (resourceGridEl) {
            resourceGridEl.innerHTML = '<div class="loading">Loading resources...</div>';
        }
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (currentFilters.category) {
            queryParams.append('category', currentFilters.category);
        }
        
        if (currentFilters.type) {
            queryParams.append('type', currentFilters.type);
        }
        
        if (currentFilters.difficulty) {
            queryParams.append('difficulty', currentFilters.difficulty);
        }
        
        if (currentFilters.search) {
            queryParams.append('search', currentFilters.search);
        }
        
        // Fetch resources from API
        const response = await fetch(`/api/resources?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load resources');
        }
        
        const resources = await response.json();
        currentResources = resources;
        
        // Calculate pagination
        totalPages = Math.ceil(resources.length / pageSize);
        
        // Display resources
        displayResources();
        updatePagination();
        
    } catch (error) {
        console.error('Error loading resources:', error);
        
        if (resourceGridEl) {
            resourceGridEl.innerHTML = `
                <div class="error-message">
                    <p>Failed to load resources. Please try again later.</p>
                    <button class="btn btn-primary" onclick="loadResources()">Retry</button>
                </div>
            `;
        }
    }
}

// Display resources with pagination
function displayResources() {
    if (!resourceGridEl) return;
    
    // Clear previous resources
    resourceGridEl.innerHTML = '';
    
    // Get current page resources
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageResources = currentResources.slice(startIndex, endIndex);
    
    // Check if there are no resources
    if (pageResources.length === 0) {
        resourceGridEl.innerHTML = `
            <div class="no-results">
                <p>No resources found matching your criteria.</p>
                ${currentFilters.search || currentFilters.category || currentFilters.type || currentFilters.difficulty ? 
                    '<button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>' : ''}
            </div>
        `;
        return;
    }
    
    // Create resource cards
    pageResources.forEach(resource => {
        const card = createResourceCard(resource);
        resourceGridEl.appendChild(card);
    });
    
    // Initialize LaTeX for the newly added content
    if (window.latex) {
        window.latex.initLatexRendering();
    }
}

// Create a resource card
function createResourceCard(resource) {
    // Map resource type to icon
    let typeIcon = '📄'; // Default
    switch (resource.type) {
        case 'book': typeIcon = '📚'; break;
        case 'video': typeIcon = '🎬'; break;
        case 'simulation': typeIcon = '🔬'; break;
        case 'article': typeIcon = '📄'; break;
        case 'problem-set': typeIcon = '📝'; break;
    }
    
    // Create card element from template
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="resource-card" data-id="${resource.id}">
            <div class="resource-image">
                <span>${typeIcon} ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
            </div>
            <div class="resource-content">
                <span class="resource-category">${resource.category}</span>
                <h3 class="resource-title">${resource.title}</h3>
                <p>${truncateText(resource.description || 'No description available.', 80)}</p>
                <div class="resource-meta">
                    <span>⭐ ${resource.rating.toFixed(1)}</span>
                    <span>👁️ ${formatNumber(resource.views)}</span>
                    <span>Updated ${formatDate(resource.updatedAt)}</span>
                </div>
            </div>
        </div>
    `.trim();
    
    const card = template.content.firstChild;
    
    // Add click event to show details
    card.addEventListener('click', () => {
        showResourceDetails(resource.id);
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
            displayResources();
            updatePagination();
            // Scroll back to the top of the grid
            resourceGridEl.scrollIntoView({ behavior: 'smooth' });
        });
        
        paginationEl.appendChild(pageItem);
    }
}

// Handle search input change
function handleSearchChange() {
    if (!searchInputEl) return;
    
    currentFilters.search = searchInputEl.value.trim();
    currentPage = 1; // Reset to first page
    loadResources();
}

// Handle filter changes
function handleFilterChange() {
    if (categoryFilterEl) {
        currentFilters.category = categoryFilterEl.value;
    }
    
    if (typeFilterEl) {
        currentFilters.type = typeFilterEl.value;
    }
    
    if (difficultyFilterEl) {
        currentFilters.difficulty = difficultyFilterEl.value;
    }
    
    currentPage = 1; // Reset to first page
    loadResources();
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        category: '',
        type: '',
        difficulty: '',
        search: ''
    };
    
    if (searchInputEl) searchInputEl.value = '';
    if (categoryFilterEl) categoryFilterEl.value = '';
    if (typeFilterEl) typeFilterEl.value = '';
    if (difficultyFilterEl) difficultyFilterEl.value = '';
    
    currentPage = 1;
    loadResources();
}

// Toggle upload resource form
function toggleUploadForm() {
    if (!uploadResourceFormEl) return;
    
    const isVisible = uploadResourceFormEl.style.display === 'block';
    
    if (isVisible) {
        uploadResourceFormEl.style.display = 'none';
    } else {
        uploadResourceFormEl.style.display = 'block';
        uploadResourceFormEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle resource upload
async function handleResourceUpload(e) {
    e.preventDefault();
    
    const form = e.target;
    const titleInput = form.querySelector('#resource-title');
    const descriptionInput = form.querySelector('#resource-description');
    const categoryInput = form.querySelector('#resource-category');
    const typeInput = form.querySelector('#resource-type');
    const difficultyInput = form.querySelector('#resource-difficulty');
    const errorEl = form.querySelector('.error-message');
    
    // Basic validation
    if (!titleInput.value.trim()) {
        errorEl.textContent = 'Please enter a title';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!categoryInput.value) {
        errorEl.textContent = 'Please select a category';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!typeInput.value) {
        errorEl.textContent = 'Please select a resource type';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!difficultyInput.value) {
        errorEl.textContent = 'Please select a difficulty level';
        errorEl.style.display = 'block';
        return;
    }
    
    // Get current user
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!currentUser) {
        errorEl.textContent = 'You must be logged in to upload a resource';
        errorEl.style.display = 'block';
        return;
    }
    
    // Create resource data
    const resource = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: categoryInput.value,
        type: typeInput.value,
        difficulty: difficultyInput.value,
        authorId: currentUser.id,
        authorName: currentUser.username,
        content: '',
        url: form.querySelector('#resource-url')?.value || ''
    };
    
    try {
        // Disable form and show loading state
        form.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = true;
        });
        
        // Send request to create resource
        const response = await fetch('/api/resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resource)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create resource');
        }
        
        // Reset form
        form.reset();
        form.style.display = 'none';
        
        // Reload resources to show the new one
        currentPage = 1;
        loadResources();
        
        // Show success message
        showToast('Resource added successfully', 'success');
        
    } catch (error) {
        console.error('Error creating resource:', error);
        errorEl.textContent = 'Failed to add resource. Please try again.';
        errorEl.style.display = 'block';
    } finally {
        // Enable form inputs
        form.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = false;
        });
    }
}

// Show resource details
async function showResourceDetails(resourceId) {
    if (!resourceDetailsEl) return;
    
    try {
        // Show loading state
        resourceDetailsEl.innerHTML = '<div class="loading">Loading resource details...</div>';
        resourceDetailsEl.style.display = 'block';
        resourceDetailsEl.scrollIntoView({ behavior: 'smooth' });
        
        // Fetch resource details
        const response = await fetch(`/api/resources/${resourceId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load resource details');
        }
        
        const resource = await response.json();
        
        // Map resource type to icon
        let typeIcon = '📄'; // Default
        switch (resource.type) {
            case 'book': typeIcon = '📚'; break;
            case 'video': typeIcon = '🎬'; break;
            case 'simulation': typeIcon = '🔬'; break;
            case 'article': typeIcon = '📄'; break;
            case 'problem-set': typeIcon = '📝'; break;
        }
        
        // Create details HTML
        const detailsHTML = `
            <button class="close-btn" onclick="closeResourceDetails()">×</button>
            <div class="resource-details-header">
                <div class="resource-details-info">
                    <span class="resource-category">${resource.category}</span>
                    <h2>${resource.title}</h2>
                    <div class="resource-details-meta">
                        <span>${typeIcon} ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                        <span>By ${resource.authorName}</span>
                        <span>Difficulty: ${resource.difficulty}</span>
                        <span>Views: ${formatNumber(resource.views)}</span>
                    </div>
                </div>
                <div class="resource-details-rating">
                    ⭐ ${resource.rating.toFixed(1)} / 5.0
                </div>
            </div>
            <div class="resource-details-content">
                <p class="latex">${resource.description || 'No description available.'}</p>
                ${resource.content ? `<div class="content-section latex">${resource.content}</div>` : ''}
                ${resource.url ? `<div class="resource-url">
                    <strong>Resource URL:</strong> 
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer">${resource.url}</a>
                </div>` : ''}
            </div>
            <div class="resource-details-actions">
                <button class="btn btn-primary" onclick="window.open('${resource.url || '#'}', '_blank')">
                    ${resource.type === 'video' ? 'Watch Video' : resource.type === 'simulation' ? 'Open Simulation' : 'View Resource'}
                </button>
                <button class="btn btn-secondary" onclick="downloadResource(${resource.id})">Download</button>
                <button class="btn btn-secondary" onclick="rateResource(${resource.id})">Rate</button>
                <button class="btn btn-secondary" onclick="shareResource(${resource.id})">Share</button>
            </div>
        `;
        
        // Update the details container
        resourceDetailsEl.innerHTML = detailsHTML;
        
        // Initialize LaTeX rendering for the new content
        if (window.latex) {
            window.latex.initLatexRendering();
        }
        
    } catch (error) {
        console.error('Error loading resource details:', error);
        resourceDetailsEl.innerHTML = `
            <div class="error-message">
                <p>Failed to load resource details. Please try again.</p>
                <button class="btn btn-primary" onclick="closeResourceDetails()">Close</button>
            </div>
        `;
    }
}

// Close resource details panel
function closeResourceDetails() {
    if (!resourceDetailsEl) return;
    resourceDetailsEl.style.display = 'none';
}

// Placeholder functions for resource actions
function downloadResource(id) {
    showToast('Download functionality not implemented yet', 'info');
}

function rateResource(id) {
    // This would open a rating dialog
    // For now, just an alert as a placeholder
    const rating = prompt('Rate this resource from 1 to 5:');
    
    if (rating !== null) {
        const numRating = parseFloat(rating);
        if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) {
            showToast(`You rated this resource ${numRating} stars`, 'success');
        } else {
            showToast('Please enter a valid rating between 1 and 5', 'error');
        }
    }
}

function shareResource(id) {
    // This would open a share dialog with social links and copy URL option
    // For now, just copy the URL to clipboard
    const url = `${window.location.origin}/library.html?resource=${id}`;
    
    navigator.clipboard.writeText(url)
        .then(() => {
            showToast('Resource link copied to clipboard', 'success');
        })
        .catch(err => {
            console.error('Failed to copy URL:', err);
            showToast('Failed to copy link', 'error');
        });
}