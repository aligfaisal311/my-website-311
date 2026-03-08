import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth, googleProvider } from "./firebase-config.js";

// DOM Elements
const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login');
const errorBox = document.getElementById('error-box');
const switchBtn = document.getElementById('switch-to-signup');
const welcomeTitle = document.querySelector('.login-card h1');
const welcomeDesc = document.querySelector('.login-card p');
const submitBtn = document.querySelector('.btn-login');

let isSignup = false;

// Handle Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        try {
            console.log("Attempting Google Sign-In...");
            await signInWithPopup(auth, googleProvider);
            console.log("Google Sign-In Success");
        } catch (error) {
            console.error("Google Login Error:", error);
            showError(error.message);
        }
    });
}

// Handle Form Submission (Login or Signup)
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (isSignup) {
                console.log("Attempting Signup for:", email);
                await createUserWithEmailAndPassword(auth, email, password);
                console.log("Signup Success");
            } else {
                console.log("Attempting Login for:", email);
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Login Success");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            showError(error.message);
        }
    });
}

// Toggle between Login and Signup
if (switchBtn) {
    switchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isSignup = !isSignup;

        if (isSignup) {
            welcomeTitle.textContent = "Create Account";
            welcomeDesc.textContent = "Join the platform to access research materials.";
            submitBtn.textContent = "Sign Up";
            switchBtn.textContent = "Login instead";
        } else {
            welcomeTitle.textContent = "Welcome Back";
            welcomeDesc.textContent = "Sign in to access Virtual Labs and Web Book materials.";
            submitBtn.textContent = "Sign In";
            switchBtn.textContent = "Sign up";
        }
        errorBox.style.display = 'none';
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
    // Only Web Book remains strictly protected for guests
    const protectedPages = ['web-book.html', 'reynolds-lab.html'];
    const currentPage = window.location.pathname.split('/').pop();

    console.log("Auth State Changed. User:", user ? user.email : "none", "Page:", currentPage);

    // Toggle visibility of auth-only elements
    const authOnlyElements = document.querySelectorAll('.auth-only');
    authOnlyElements.forEach(el => {
        el.style.display = user ? 'block' : 'none';
        // Handle list items specifically if needed for navbar layout
        if (el.tagName === 'LI' && user) {
            el.style.display = 'list-item';
        }
    });

    if (user) {
        if (currentPage === 'login.html') {
            window.location.href = 'virtual-lab.html';
        }
        updateNavForAuth(user);
    } else {
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
        updateNavForAuth(null);
    }
});

function updateNavForAuth(user) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    let loginBtn = document.getElementById('login-link');
    let logoutBtn = document.getElementById('logout-btn');

    if (user) {
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
        if (logoutBtn) logoutBtn.parentElement.remove();
        if (!loginBtn) {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="login.html" id="login-link" class="nav-link">Student Login</a>`;
            navLinks.appendChild(loginLi);
        }
    }
}

export { auth };
