// Simple interactivity: Toggle comments
function toggleComments(element) {
    const comments = element.nextElementSibling;
    if (comments.style.display === 'none' || comments.style.display === '') {
        comments.style.display = 'block';
        element.textContent = 'Hide Comments';
    } else {
        comments.style.display = 'none';
        element.textContent = 'Show Comments';
    }
}


// Basic navigation (client-side, no page reload)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        document.querySelectorAll('.container section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(targetId).style.display = 'block';
    });
});

// Show home by default
document.getElementById('home').style.display = 'block';



//Dark Mode

const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

// Load saved mode after declaring body
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
  body.classList.add('dark-mode');
}

toggleButton.addEventListener('click', () => {
	body.classList.toggle('dark-mode'); //adds/removes the class
	const isDark = body.classList.contains('dark-mode');
	localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});






