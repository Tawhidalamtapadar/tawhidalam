/**
 * script.js - Interactive Business Portfolio Controller
 * Tawhid Alam Tapadar Portfolio Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize global features
    initThemeToggle();
    initMobileNav();
    initScrollReveal();
    
    // Page-specific initializations
    if (document.querySelector('.stats-dashboard')) {
        initHomeStats();
    }
    if (document.querySelector('.auditor-widget-card')) {
        initAuditorWidget();
    }
    if (document.getElementById('bantForm')) {
        initContactForm();
    }
    if (document.querySelector('.circle-progress')) {
        initLanguageCircles();
    }
    if (document.querySelector('.simulator-layout')) {
        initCallSimulator();
    }
});

/* ==========================================
   1. Theme Toggle Logic (Slate Dark / light)
   ========================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeBtn, savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeBtn, newTheme);
    });
}

function updateThemeIcon(btn, theme) {
    if (theme === 'light') {
        btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
}

/* ==========================================
   2. Mobile Navigation Toggle
   ========================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileNav');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', () => {
        const isActive = mobileMenu.classList.contains('active');
        if (isActive) {
            mobileMenu.classList.remove('active');
            hamburger.style.transform = 'none';
        } else {
            mobileMenu.classList.add('active');
            hamburger.style.transform = 'scale(0.95)';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

/* ==========================================
   3. Scroll Reveal (Intersection Observer)
   ========================================== */
function initScrollReveal() {
    const triggers = document.querySelectorAll('.fade-up-trigger');
    if (triggers.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    triggers.forEach(trigger => observer.observe(trigger));
}

/* ==========================================
   4. Numerical Stat Counter & Progress Bars
   ========================================== */
function initHomeStats() {
    const statCards = document.querySelectorAll('.stat-card');
    const statsContainer = document.querySelector('.stats-dashboard');
    if (!statsContainer) return;
    
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animateProgressBars();
                animated = true;
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(statsContainer);
    
    function animateCounters() {
        statCards.forEach(card => {
            const numEl = card.querySelector('.stat-number');
            const targetVal = parseFloat(numEl.dataset.value);
            const prefix = numEl.dataset.prefix || '';
            const suffix = numEl.dataset.suffix || '';
            let currentVal = 0;
            const duration = 1200; // ms
            const steps = 50;
            const stepVal = targetVal / steps;
            const stepInterval = duration / steps;
            
            let count = 0;
            const timer = setInterval(() => {
                count++;
                currentVal += stepVal;
                
                if (count >= steps) {
                    clearInterval(timer);
                    numEl.textContent = prefix + targetVal.toLocaleString() + suffix;
                } else {
                    if (targetVal % 1 === 0) {
                        numEl.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
                    } else {
                        numEl.textContent = prefix + currentVal.toFixed(1) + suffix;
                    }
                }
            }, stepInterval);
        });
    }

    function animateProgressBars() {
        statCards.forEach(card => {
            const bar = card.querySelector('.stat-progress-bar');
            if (bar) {
                const targetWidth = bar.dataset.width || '100%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }
        });
    }
}

/* ==========================================
   5. Circular Language Meters (about.html)
   ========================================== */
function initLanguageCircles() {
    const circles = document.querySelectorAll('.circle-progress');
    
    circles.forEach(circle => {
        const percent = parseInt(circle.dataset.percent);
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const offset = circumference - (percent / 100) * circumference;
                    circle.style.strokeDashoffset = offset;
                    observer.unobserve(circle);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(circle.parentElement);
    });
}

/* ==========================================
   6. Recruiter Challenge Auditor Widget
   ========================================== */
function initAuditorWidget() {
    const tabs = document.querySelectorAll('.auditor-tab-btn');
    const results = document.querySelectorAll('.auditor-result');
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            results.forEach(r => r.classList.remove('active'));
            
            tab.classList.add('active');
            const target = tab.dataset.target;
            const targetEl = document.getElementById(target);
            if (targetEl) {
                targetEl.classList.add('active');
            }
        });
    });
}

/* ==========================================
   7. Recruiter Message Form & Alert Console
   ========================================== */
function initContactForm() {
    const form = document.getElementById('bantForm');
    const alertEl = document.getElementById('crmConsoleAlert');
    if (!form || !alertEl) return;
    
    form.addEventListener('submit', (e) => {
        // Grab data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        const message = document.getElementById('need').value;
        
        // Populate CRM Alert log
        document.getElementById('crmLeadName').textContent = name;
        document.getElementById('crmLeadEmail').textContent = email;
        document.getElementById('crmBantB').textContent = company;
        document.getElementById('crmBantN').textContent = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        
        // Show console alert
        alertEl.classList.add('show');
        
        // Reset form with a slight delay to allow the browser to serialize input values before they are cleared
        setTimeout(() => {
            form.reset();
        }, 100);
        
        // Hide after 8 seconds
        setTimeout(() => {
            alertEl.classList.remove('show');
        }, 8000);
    });
}

/* ==========================================
   8. Dialogue Call Objection Simulator (simulator.html)
   ========================================== */
function initCallSimulator() {
    const objectionBtns = document.querySelectorAll('.objection-btn');
    const screenStandby = document.querySelector('.screen-standby');
    const screenActiveCall = document.querySelector('.screen-active-call');
    const chatHistory = document.querySelector('.chat-history');
    const typingIndicator = document.getElementById('typingIndicator');
    const callTimer = document.getElementById('callTimer');
    const hangupBtn = document.getElementById('hangupBtn');
    
    if (objectionBtns.length === 0 || !screenStandby || !screenActiveCall) return;
    
    let timerInterval = null;
    let secondsElapsed = 0;
    
    const responses = {
        budget: "I completely respect that. Budget constraints are very common. In fact, many of our clients had the same concern before seeing how we automate lead qualified cycles to save BDM hours. If I could show you how we typical deliver a 3x return in pipeline efficiency, would you be open to a brief 5-minute sync next week?",
        email: "I can definitely send you an email. However, to save your inbox from generic pitches, could I ask you one quick question? Are you currently logging outbound outreach manually, or is it automated in your CRM?",
        competitor: "That is great to hear! It means you already see the value of outbound systems. Many of our current clients were with competitors too, but they switched to leverage our custom API integrations that reduce data entry by 40%. Would you be open to a quick comparison?",
        busy: "I completely understand, time is valuable. I won't take more than 30 seconds. I just wanted to see if your team is struggling with low outreach volume or messy CRM records. If both are fine, we can connect next quarter. If not, does a 5-minute call save you time?"
    };
    
    objectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const objectionType = btn.dataset.objection;
            const objectionText = btn.querySelector('span:last-child').textContent;
            
            // Switch screens
            screenStandby.style.display = 'none';
            screenActiveCall.style.display = 'flex';
            
            // Add prospect bubble
            appendChatBubble(objectionText, 'prospect');
            
            // Start call timer
            startCallTimer();
            
            // Show typing/thinking indicator
            typingIndicator.style.display = 'flex';
            chatHistory.scrollTop = chatHistory.scrollHeight;
            
            // Generate Tawhid response
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                const replyText = responses[objectionType] || "I appreciate your response. Let's discuss how we can work together to hit your sales numbers.";
                appendChatBubble(replyText, 'tawhid');
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }, 1500);
        });
    });
    
    hangupBtn.addEventListener('click', () => {
        // Reset timer
        clearInterval(timerInterval);
        secondsElapsed = 0;
        callTimer.textContent = '00:00';
        
        // Reset chat history
        chatHistory.innerHTML = '';
        typingIndicator.style.display = 'none';
        
        // Switch screen back
        screenActiveCall.style.display = 'none';
        screenStandby.style.display = 'flex';
    });
    
    function appendChatBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.textContent = text;
        chatHistory.appendChild(bubble);
    }
    
    function startCallTimer() {
        clearInterval(timerInterval);
        secondsElapsed = 0;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            callTimer.textContent = `${mins}:${secs}`;
        }, 1000);
    }
}
