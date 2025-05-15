/**
 * Quanta - Physics Education Platform
 * LaTeX Rendering Functionality
 * 
 * Note: This is a simple placeholder renderer for LaTeX.
 * In a production environment, you would use a proper LaTeX rendering library 
 * like KaTeX or MathJax for accurate rendering.
 */

/**
 * Convert LaTeX in a text to HTML
 * @param {string} text - Text that may contain LaTeX delimited by $ or $$
 * @returns {string} - HTML with rendered LaTeX (placeholder for actual implementation)
 */
function renderLatex(text) {
    if (!text) return '';
    
    // Simple placeholder implementation
    // For inline LaTeX: $E = mc^2$
    // For block LaTeX: $$F = ma$$
    
    // In a real implementation, you would use a library like KaTeX or MathJax
    // This is just a visual representation to show how it would work
    
    // Process block LaTeX ($$...$$)
    let processedText = text.replace(/\$\$(.*?)\$\$/g, '<div class="math-block">$1</div>');
    
    // Process inline LaTeX ($...$)
    processedText = processedText.replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>');
    
    return processedText;
}

/**
 * Parse and render LaTeX in an element
 * @param {HTMLElement} element - Element containing LaTeX to render
 */
function renderLatexInElement(element) {
    if (!element) return;
    
    // Get the innerHTML
    const content = element.innerHTML;
    
    // Render LaTeX
    element.innerHTML = renderLatex(content);
}

/**
 * Initialize LaTeX rendering for all elements with the 'latex' class
 */
function initLatexRendering() {
    // Find all elements with the 'latex' class
    const latexElements = document.querySelectorAll('.latex');
    
    // Render LaTeX in each element
    latexElements.forEach(element => {
        renderLatexInElement(element);
    });
}

// Add global LaTeX CSS
const latexCSS = `
    .math-inline {
        font-family: "Latin Modern Math", serif;
        font-style: italic;
        color: #0f3460;
        background-color: rgba(240, 240, 240, 0.5);
        padding: 0 5px;
        border-radius: 3px;
    }
    
    .math-block {
        font-family: "Latin Modern Math", serif;
        text-align: center;
        margin: 1em 0;
        padding: 0.5em;
        color: #0f3460;
        background-color: rgba(240, 240, 240, 0.5);
        border-radius: 5px;
        overflow-x: auto;
    }
    
    .dark-mode .math-inline,
    .dark-mode .math-block {
        color: #6fdfdf;
        background-color: rgba(15, 52, 96, 0.5);
    }
`;

// Add LaTeX CSS to the document
function addLatexCSS() {
    const style = document.createElement('style');
    style.textContent = latexCSS;
    document.head.appendChild(style);
}

// Initialize LaTeX rendering when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    addLatexCSS();
    initLatexRendering();
});

// Export LaTeX functions
window.latex = {
    renderLatex,
    renderLatexInElement,
    initLatexRendering
};