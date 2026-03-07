import {
    signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth, googleProvider } from "./firebase-config.js";

// DOM Elements
const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login');
const errorBox = document.getElementById('error-box');

// Handle Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // Redirection handled by onAuthStateChanged
        } catch (error) {
            showError(error.message);
        }
    });
}

// Handle Email/Password Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            showError(error.message);
        }
    });
}

function showError(message) {
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
}

// Global Auth State Observer
onAuthStateChanged(auth, (user) => {
    const protectedPages = ['virtual-lab.html', 'web-book.html', 'reynolds-lab.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // User is signed in
        if (currentPage === 'login.html') {
            window.location.href = 'index.html';
        }
        // Update UI (e.g., change "Login" to "Logout")
        updateNavForAuth(user);
    } else {
        // User is signed out
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
        updateNavForAuth(null);
    }
});

function updateNavForAuth(user) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Check if login/logout links already exist
    let loginBtn = document.getElementById('login-link');
    let logoutBtn = document.getElementById('logout-btn');

    if (user) {
        // User is LOGGED IN: Show Logout, hide Login
        if (loginBtn) loginBtn.parentElement.remove();

        if (!logoutBtn) {
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = `<a href="#" id="logout-btn" class="nav-link">Logout</a>`;
            navLinks.appendChild(logoutLi);

            logoutBtn = document.getElementById('logout-btn');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                signOut(auth).then(() => {
                    window.location.reload();
                });
            });
        }
    } else {
        // User is LOGGED OUT: Show Login, hide Logout
        if (logoutBtn) logoutBtn.parentElement.remove();

        if (!loginBtn) {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="login.html" id="login-link" class="nav-link">Student Login</a>`;
            navLinks.appendChild(loginLi);
        }
    }
}

export { auth };
