// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scroll with Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const username = 'vikashere96';
    const projectsGrid = document.querySelector('.projects-grid');

    if (!projectsGrid) return;

    try {
        // Fetch repos with topics
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json'
            }
        });
        const repos = await response.json();

        if (repos.message === 'Not Found' || !Array.isArray(repos)) {
            return;
        }

        // Projects to skip (already featured in main projects)
        const skipProjects = [
            'ice-cream-app',
            'icecream-app',
            'ice-cream-qr',
            'ice-cream-ordering',
            'tic-tac-toe',
            'tictactoe',
            'tic-tac-toe-unity',
            'tic-tac-toe-game',
            'portfolio',
            'Portfolio'
        ];

        // Filter out forked repos, skip featured projects, and sort by stars
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .filter(repo => !skipProjects.some(skip =>
                repo.name.toLowerCase().includes(skip.toLowerCase())
            ))
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4);

        if (filteredRepos.length === 0) {
            return;
        }

        // Color gradients for GitHub projects
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];

        // Create GitHub project cards
        filteredRepos.forEach((repo, index) => {
            const description = repo.description || 'A project from my GitHub repository';
            const language = repo.language || 'Code';
            const gradient = gradients[index % gradients.length];

            // Get language icon
            const langIcons = {
                'JavaScript': 'fab fa-js',
                'Python': 'fab fa-python',
                'Java': 'fab fa-java',
                'PHP': 'fab fa-php',
                'HTML': 'fab fa-html5',
                'CSS': 'fab fa-css3-alt',
                'C#': 'fas fa-code',
                'C++': 'fas fa-code',
                'TypeScript': 'fab fa-js',
                'Dart': 'fas fa-code',
                'Kotlin': 'fas fa-code'
            };
            const icon = langIcons[language] || 'fas fa-code';

            // Create project card element
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card github-project';
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(30px)';

            // Format dates
            const updatedDate = new Date(repo.updated_at);
            const formattedDate = updatedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });

            // Get repository topics/tags
            const topics = repo.topics || [];
            const topicsHTML = topics.slice(0, 3).map(topic =>
                `<span class="tech-badge"><i class="fas fa-tag"></i> ${topic}</span>`
            ).join('');

            // Calculate repository size
            const sizeInMB = (repo.size / 1024).toFixed(1);

            projectCard.innerHTML = `
                <div class="project-image" style="background: ${gradient};">
                    <i class="${icon}"></i>
                    <div class="project-badge">
                        <i class="fab fa-github"></i> GitHub
                    </div>
                </div>
                <div class="project-content">
                    <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>${description}</p>
                    
                    <div class="project-stats">
                        ${language ? `
                            <div class="stat-item">
                                <i class="${icon}"></i>
                                <span>${language}</span>
                            </div>
                        ` : ''}
                        ${repo.stargazers_count > 0 ? `
                            <div class="stat-item">
                                <i class="fas fa-star"></i>
                                <span>${repo.stargazers_count} stars</span>
                            </div>
                        ` : ''}
                        ${repo.forks_count > 0 ? `
                            <div class="stat-item">
                                <i class="fas fa-code-branch"></i>
                                <span>${repo.forks_count} forks</span>
                            </div>
                        ` : ''}
                        <div class="stat-item">
                            <i class="fas fa-clock"></i>
                            <span>Updated ${formattedDate}</span>
                        </div>
                    </div>
                    
                    ${topics.length > 0 ? `
                        <div class="project-tech">
                            ${topicsHTML}
                        </div>
                    ` : ''}
                    
                    <ul class="project-highlights">
                        ${repo.stargazers_count > 0 ? `<li><i class="fas fa-check-circle"></i> ${repo.stargazers_count} developers starred this project</li>` : ''}
                        ${repo.open_issues_count > 0 ? `<li><i class="fas fa-check-circle"></i> ${repo.open_issues_count} open issues for collaboration</li>` : ''}
                        ${sizeInMB > 0 ? `<li><i class="fas fa-check-circle"></i> Repository size: ${sizeInMB} MB</li>` : ''}
                        ${repo.license ? `<li><i class="fas fa-check-circle"></i> License: ${repo.license.name}</li>` : ''}
                    </ul>
                    
                    <div class="project-links" style="margin-top: 1rem;">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> View Code
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;

            // Append to grid
            projectsGrid.appendChild(projectCard);

            // Animate card
            setTimeout(() => {
                projectCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, (index + 4) * 150);
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:vikashere96@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    alert('Thank you for your message! Your email client will open to send the message.');
    contactForm.reset();
});

// Typing Effect for Hero Section
const heroSubtitle = document.querySelector('.hero-subtitle');
const titles = [
    'Web Developer',
    'Django Developer',
    'PHP Developer',
    'Game Developer',
    'Android Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        heroSubtitle.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        heroSubtitle.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const shapes = document.querySelectorAll('.shape');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// Skill Tags Animation
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
});

// Add cursor pointer effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
    document.body.appendChild(cursor);

    setTimeout(() => {
        cursor.remove();
    }, 1000);
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console Easter Egg
console.log('%c👋 Hello there!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cLooking for something? Check out my GitHub: https://github.com/vikashere96/', 'font-size: 14px; color: #94a3b8;');
console.log('%cLet\'s connect! 🚀', 'font-size: 14px; color: #8b5cf6;');
