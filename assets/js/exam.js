/**
 * Quanta - Physics Education Platform
 * Exam Preparation Page JavaScript
 */

// Global variables
let currentQuestions = [];
let currentAnswers = {};
let currentQuestion = 0;
let totalQuestions = 0;
let examSettings = {
    topic: 'all',
    difficulty: 2,
    count: 10
};
let examStarted = false;
let examCompleted = false;
let reviewMode = false;

// DOM Elements
let topicSelectorEl;
let difficultySelectorEl;
let difficultyValueEl;
let countSelectorEl;
let startTestBtnEl;
let questionCardEl;
let progressBarEl;
let progressTextEl;
let navigationBtnNextEl;
let navigationBtnPrevEl;
let navigationBtnFinishEl;
let resultsContainerEl;
let questionNavEl;

// Initialize exam page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    topicSelectorEl = document.getElementById('topic-selector');
    difficultySelectorEl = document.getElementById('difficulty-slider');
    difficultyValueEl = document.getElementById('difficulty-value');
    countSelectorEl = document.getElementById('count-selector');
    startTestBtnEl = document.getElementById('start-test-btn');
    questionCardEl = document.getElementById('question-card');
    progressBarEl = document.getElementById('progress-fill');
    progressTextEl = document.getElementById('progress-text');
    navigationBtnNextEl = document.getElementById('nav-next');
    navigationBtnPrevEl = document.getElementById('nav-prev');
    navigationBtnFinishEl = document.getElementById('nav-finish');
    resultsContainerEl = document.getElementById('results-container');
    questionNavEl = document.getElementById('question-nav');
    
    // Add event listeners
    if (topicSelectorEl) {
        topicSelectorEl.addEventListener('change', updateSettings);
    }
    
    if (difficultySelectorEl) {
        difficultySelectorEl.addEventListener('input', updateDifficultyValue);
        difficultySelectorEl.addEventListener('change', updateSettings);
    }
    
    if (countSelectorEl) {
        countSelectorEl.addEventListener('change', updateSettings);
    }
    
    if (startTestBtnEl) {
        startTestBtnEl.addEventListener('click', startExam);
    }
    
    if (navigationBtnNextEl) {
        navigationBtnNextEl.addEventListener('click', nextQuestion);
    }
    
    if (navigationBtnPrevEl) {
        navigationBtnPrevEl.addEventListener('click', prevQuestion);
    }
    
    if (navigationBtnFinishEl) {
        navigationBtnFinishEl.addEventListener('click', finishExam);
    }
    
    // Initialize settings
    updateDifficultyValue();
    updateNavigation();
    
    // Check URL for auto-start
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('topic')) {
        const topic = urlParams.get('topic');
        if (topicSelectorEl && topicSelectorEl.querySelector(`option[value="${topic}"]`)) {
            topicSelectorEl.value = topic;
        }
    }
    
    if (urlParams.has('difficulty')) {
        const difficulty = parseInt(urlParams.get('difficulty'));
        if (!isNaN(difficulty) && difficulty >= 1 && difficulty <= 5) {
            difficultySelectorEl.value = difficulty;
            updateDifficultyValue();
        }
    }
    
    if (urlParams.has('count')) {
        const count = parseInt(urlParams.get('count'));
        if (!isNaN(count) && count >= 5 && count <= 50) {
            countSelectorEl.value = count;
        }
    }
    
    if (urlParams.has('start') && urlParams.get('start') === 'true') {
        updateSettings();
        startExam();
    }
    
    // Initialize LaTeX rendering
    if (window.latex) {
        window.latex.initLatexRendering();
    }
});

// Update difficulty value display
function updateDifficultyValue() {
    if (!difficultySelectorEl || !difficultyValueEl) return;
    
    const value = difficultySelectorEl.value;
    difficultyValueEl.textContent = value;
    
    // Update difficulty labels
    const difficultyLabels = {
        1: 'Easy',
        2: 'Beginner',
        3: 'Intermediate',
        4: 'Advanced',
        5: 'Expert'
    };
    
    document.getElementById('difficulty-label').textContent = difficultyLabels[value] || 'Intermediate';
}

// Update exam settings
function updateSettings() {
    if (topicSelectorEl) {
        examSettings.topic = topicSelectorEl.value;
    }
    
    if (difficultySelectorEl) {
        examSettings.difficulty = parseInt(difficultySelectorEl.value);
    }
    
    if (countSelectorEl) {
        examSettings.count = parseInt(countSelectorEl.value);
    }
}

// Start the exam
async function startExam() {
    try {
        // Update settings
        updateSettings();
        
        // Show loading state
        if (questionCardEl) {
            questionCardEl.innerHTML = '<div class="loading">Loading questions...</div>';
        }
        
        // Hide results if visible
        if (resultsContainerEl) {
            resultsContainerEl.style.display = 'none';
        }
        
        // Show exam container
        document.getElementById('exam-container').style.display = 'grid';
        
        // Reset state
        currentQuestions = [];
        currentAnswers = {};
        currentQuestion = 0;
        examStarted = true;
        examCompleted = false;
        reviewMode = false;
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('topic', examSettings.topic === 'all' ? '' : examSettings.topic);
        queryParams.append('difficulty', examSettings.difficulty);
        queryParams.append('count', examSettings.count);
        
        // Fetch questions from API
        const response = await fetch(`/api/exams/questions?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load exam questions');
        }
        
        const questions = await response.json();
        
        if (!questions || questions.length === 0) {
            throw new Error('No questions available for this topic');
        }
        
        currentQuestions = questions;
        totalQuestions = questions.length;
        
        // Setup question navigation
        setupQuestionNavigation();
        
        // Display first question
        displayQuestion(0);
        updateProgressBar();
        updateNavigation();
        
    } catch (error) {
        console.error('Error starting exam:', error);
        
        if (questionCardEl) {
            questionCardEl.innerHTML = `
                <div class="error-message">
                    <p>${error.message || 'Failed to load exam questions. Please try again.'}</p>
                    <button class="btn btn-primary" onclick="startExam()">Retry</button>
                </div>
            `;
        }
    }
}

// Setup question navigation buttons
function setupQuestionNavigation() {
    if (!questionNavEl) return;
    
    questionNavEl.innerHTML = '';
    
    for (let i = 0; i < currentQuestions.length; i++) {
        const navButton = document.createElement('button');
        navButton.className = 'btn btn-sm';
        navButton.textContent = i + 1;
        navButton.addEventListener('click', () => {
            goToQuestion(i);
        });
        
        questionNavEl.appendChild(navButton);
    }
    
    updateQuestionNavigation();
}

// Update question navigation buttons
function updateQuestionNavigation() {
    if (!questionNavEl) return;
    
    const buttons = questionNavEl.querySelectorAll('button');
    
    buttons.forEach((button, index) => {
        // Reset classes
        button.className = 'btn btn-sm';
        
        // Current question
        if (index === currentQuestion) {
            button.classList.add('btn-primary');
        } 
        // Answered questions
        else if (currentAnswers[index] !== undefined) {
            if (reviewMode) {
                if (currentAnswers[index] === currentQuestions[index].correctOption) {
                    button.classList.add('btn-success');
                } else {
                    button.classList.add('btn-danger');
                }
            } else {
                button.classList.add('btn-secondary');
            }
        } 
        // Unanswered questions
        else {
            button.classList.add('btn-outline');
        }
    });
}

// Display a question
function displayQuestion(index) {
    if (!questionCardEl || !currentQuestions[index]) return;
    
    const question = currentQuestions[index];
    currentQuestion = index;
    
    const optionsHTML = question.options.map((option, i) => {
        const selected = currentAnswers[index] === i;
        const optionClass = reviewMode 
            ? (i === question.correctOption 
                ? 'correct' 
                : (selected && i !== question.correctOption ? 'incorrect' : ''))
            : (selected ? 'selected' : '');
            
        return `
            <li class="option-item ${optionClass}" data-index="${i}">
                ${option}
            </li>
        `;
    }).join('');
    
    questionCardEl.innerHTML = `
        <div class="question-number">Question ${index + 1} of ${totalQuestions}</div>
        <div class="question-text latex">${question.question}</div>
        <ul class="options-list">
            ${optionsHTML}
        </ul>
        ${reviewMode ? `
            <div class="explanation latex">
                <strong>Explanation:</strong> ${question.explanation || 'No explanation available.'}
            </div>
        ` : ''}
    `;
    
    // Add click handlers for options if not in review mode
    if (!reviewMode) {
        const optionItems = questionCardEl.querySelectorAll('.option-item');
        
        optionItems.forEach(item => {
            item.addEventListener('click', () => {
                const optionIndex = parseInt(item.dataset.index);
                selectAnswer(optionIndex);
            });
        });
    }
    
    // Initialize LaTeX for the new content
    if (window.latex) {
        window.latex.initLatexRendering();
    }
    
    // Update navigation status
    updateQuestionNavigation();
    updateProgressBar();
    updateNavigation();
}

// Select an answer
function selectAnswer(optionIndex) {
    currentAnswers[currentQuestion] = optionIndex;
    
    // Update selected option in UI
    const optionItems = questionCardEl.querySelectorAll('.option-item');
    
    optionItems.forEach((item, index) => {
        if (index === optionIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Update navigation
    updateQuestionNavigation();
    updateNavigation();
    
    // Automatically go to next question if not the last one
    if (currentQuestion < totalQuestions - 1) {
        setTimeout(() => {
            nextQuestion();
        }, 500);
    }
}

// Go to next question
function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        goToQuestion(currentQuestion + 1);
    }
}

// Go to previous question
function prevQuestion() {
    if (currentQuestion > 0) {
        goToQuestion(currentQuestion - 1);
    }
}

// Go to a specific question
function goToQuestion(index) {
    if (index >= 0 && index < totalQuestions) {
        displayQuestion(index);
    }
}

// Update progress bar
function updateProgressBar() {
    if (!progressBarEl || !progressTextEl) return;
    
    const answeredCount = Object.keys(currentAnswers).length;
    const progressPercent = (answeredCount / totalQuestions) * 100;
    
    progressBarEl.style.width = `${progressPercent}%`;
    progressTextEl.textContent = `${answeredCount} of ${totalQuestions} answered`;
}

// Update navigation buttons
function updateNavigation() {
    if (!navigationBtnPrevEl || !navigationBtnNextEl || !navigationBtnFinishEl) return;
    
    // Previous button
    if (currentQuestion > 0) {
        navigationBtnPrevEl.removeAttribute('disabled');
    } else {
        navigationBtnPrevEl.setAttribute('disabled', 'true');
    }
    
    // Next button
    if (currentQuestion < totalQuestions - 1) {
        navigationBtnNextEl.removeAttribute('disabled');
    } else {
        navigationBtnNextEl.setAttribute('disabled', 'true');
    }
    
    // Finish button
    const answeredCount = Object.keys(currentAnswers).length;
    
    if (answeredCount === totalQuestions || reviewMode) {
        navigationBtnFinishEl.removeAttribute('disabled');
    } else {
        navigationBtnFinishEl.setAttribute('disabled', 'true');
    }
}

// Finish the exam
function finishExam() {
    if (reviewMode) {
        // End review mode and return to start
        examStarted = false;
        document.getElementById('exam-container').style.display = 'none';
        return;
    }
    
    // Calculate score
    const score = calculateScore();
    examCompleted = true;
    
    // Show results
    showResults(score);
    
    // Enter review mode
    reviewMode = true;
    displayQuestion(0);
    updateNavigation();
}

// Calculate exam score
function calculateScore() {
    let correct = 0;
    let totalAnswered = 0;
    
    Object.keys(currentAnswers).forEach(questionIndex => {
        const question = currentQuestions[questionIndex];
        const userAnswer = currentAnswers[questionIndex];
        
        if (userAnswer === question.correctOption) {
            correct++;
        }
        
        totalAnswered++;
    });
    
    return {
        correct,
        totalAnswered,
        percentage: Math.round((correct / totalQuestions) * 100)
    };
}

// Show exam results
function showResults(score) {
    if (!resultsContainerEl) return;
    
    resultsContainerEl.innerHTML = `
        <h2>Exam Results</h2>
        <div class="score-display">${score.percentage}%</div>
        <div class="results-summary">
            <p>You answered ${score.correct} out of ${totalQuestions} questions correctly.</p>
            <p>Topic: ${topicSelectorEl.options[topicSelectorEl.selectedIndex].text}</p>
            <p>Difficulty: ${document.getElementById('difficulty-label').textContent}</p>
        </div>
        <div class="results-actions">
            <button class="btn btn-primary" onclick="startExam()">Try Again</button>
            <button class="btn btn-secondary" onclick="reviewAnswers()">Review Answers</button>
        </div>
    `;
    
    resultsContainerEl.style.display = 'block';
}

// Review answers
function reviewAnswers() {
    if (!resultsContainerEl) return;
    
    // Hide results
    resultsContainerEl.style.display = 'none';
    
    // Ensure review mode is on
    reviewMode = true;
    
    // Show the first question in review mode
    displayQuestion(0);
    updateNavigation();
}

// Show topic performance (placeholder)
function showTopicPerformance() {
    // Get user data from storage
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!currentUser) {
        showToast('Please log in to view your performance history', 'info');
        return;
    }
    
    // This would fetch real user progress from the API in a production app
    // For now, we'll use placeholder data
    showToast('Performance data loading is not implemented in this demo', 'info');
}