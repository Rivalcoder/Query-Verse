// DOM Elements
const homeLink = document.getElementById('homeLink');
const signinLink = document.getElementById('signinLink');
const signupLink = document.getElementById('signupLink');
const dashboardLink = document.getElementById('dashboardLink');
const logoutLink = document.getElementById('logoutLink');

const homeSection = document.getElementById('homeSection');
const signinSection = document.getElementById('signinSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');

const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const userInfo = document.getElementById('userInfo');

// API URL
const API_URL = 'http://localhost:3000/api';

// Navigation Functions
function showSection(section) {
    [homeSection, signinSection, signupSection, dashboardSection].forEach(s => {
        s.style.display = 'none';
    });
    section.style.display = 'block';
}

function updateNavigation(isLoggedIn) {
    homeLink.style.display = 'inline';
    signinLink.style.display = isLoggedIn ? 'none' : 'inline';
    signupLink.style.display = isLoggedIn ? 'none' : 'inline';
    dashboardLink.style.display = isLoggedIn ? 'inline' : 'none';
    logoutLink.style.display = isLoggedIn ? 'inline' : 'none';
}

// Event Listeners for Navigation
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(homeSection);
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    homeLink.classList.add('active');
});

signinLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(signinSection);
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    signinLink.classList.add('active');
});

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(signupSection);
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    signupLink.classList.add('active');
});

dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(dashboardSection);
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    dashboardLink.classList.add('active');
    loadDashboard();
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateNavigation(false);
    showSection(homeSection);
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    homeLink.classList.add('active');
});

// Authentication Functions
async function signIn(username, password) {
    try {
        const response = await fetch(`${API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        updateNavigation(true);
        showSection(dashboardSection);
        loadDashboard();
    } catch (error) {
        alert(error.message);
    }
}

async function signUp(username, password, role) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('Sign up successful! Please sign in.');
        showSection(signinSection);
    } catch (error) {
        alert(error.message);
    }
}

async function loadDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        updateNavigation(false);
        showSection(homeSection);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const user = JSON.parse(localStorage.getItem('user'));
        userInfo.innerHTML = `
            <h3>User Information</h3>
            <p>Username: ${user.username}</p>
            <p>Role: ${user.role}</p>
        `;
    } catch (error) {
        alert(error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateNavigation(false);
        showSection(homeSection);
    }
}

// Form Event Listeners
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;
    signIn(username, password);
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    signUp(username, password, role);
});

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        updateNavigation(true);
        loadDashboard();
    } else {
        updateNavigation(false);
    }
});
