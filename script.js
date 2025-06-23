// script.js
import { auth } from './firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    getAuth,
    onAuthStateChanged,
    updateProfile 
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  

// ===== FIREBASE CONFIG AND INIT (CDN VERSION) =====
const firebaseConfig = {
    apiKey: "AIzaSyAElWc1Uvp8MNLme8ZJp9JUokp1jEKciQI",
    authDomain: "fundisapp-ec0d6.firebaseapp.com",
    projectId: "fundisapp-ec0d6",
    storageBucket: "fundisapp-ec0d6.appspot.com",
    messagingSenderId: "1061351049872",
    appId: "1:1061351049872:web:8bcc7d7d9b31acb8bda615"
};

// Initialize Firebase with error handling
try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
} catch (err) {
    console.error('Firebase initialization error:', err);
}

// ===== DOM LOADED EVENT =====
document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const getStartedBtns = document.querySelectorAll("#getStartedBtn");

    // Modal management with improved event delegation
    const handleModalClick = (e) => {
        if (e.target.id === "login-section" || e.target.id === "register-section") {
            closeModal('all');
        }
    };

    const openModal = (modalId) => {
        closeModal('all');
        const modal = document.getElementById(`${modalId}-section`);
        if (modal) modal.classList.remove('hidden');
    };

    const closeModal = (modalId) => {
        if (modalId === 'all' || modalId === 'login') {
            loginSection?.classList.add('hidden');
        }
        if (modalId === 'all' || modalId === 'register') {
            registerSection?.classList.add('hidden');
        }
    };

    // Button event listeners with error handling
    loginBtn?.addEventListener("click", () => openModal('login'));
    registerBtn?.addEventListener("click", () => openModal('register'));
    getStartedBtns?.forEach(btn => btn.addEventListener("click", () => openModal('login')));

    window.switchToRegister = () => openModal('register');
    window.switchToLogin = () => openModal('login');

    // Improved click outside detection
    window.addEventListener("click", handleModalClick);

    // ===== REGISTER FORM =====
    document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.toLowerCase();
        const password = document.getElementById("registerPassword").value;

        // Input validation with detailed error messages
        const validationErrors = validateRegistration(name, email, password);
        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'));
            return;
        }

        try {
            // Show loading state
            setLoadingState(true);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            
            // Send verification email
            await sendEmailVerification(userCredential.user);
            
            // Reset form and show success message
            document.getElementById("registerForm").reset();
            alert("Account created! Please verify your email before logging in.");
            switchToLogin();

        } catch (error) {
            handleError(error);
        } finally {
            setLoadingState(false);
        }
    });

    // ===== LOGIN FORM =====
    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.toLowerCase();
        const password = document.getElementById("loginPassword").value;

        try {
            setLoadingState(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // if (!user.emailVerified) {
            //     throw new Error("Please verify your email address before continuing.");
            // }

            localStorage.setItem("loggedInUser", JSON.stringify({
                name: user.displayName,
                email: user.email
            }));

            alert(`Welcome back, ${user.displayName}!`);
            window.location.href = "dashboard.html";

        } catch (error) {
            handleError(error);
        } finally {
            setLoadingState(false);
        }
    });

    // ===== AUTH STATE CHANGES =====
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User logged in:', user);
        } else {
            console.log('No user logged in');
        }
    });
});

// Utility functions
function validateRegistration(name, email, password) {
    const errors = [];
    
    if (!name || name.split(" ").length < 2) {
        errors.push("Please enter a valid full name with at least two words");
    }
    if (/[^a-zA-Z\s]/.test(name)) {
        errors.push("Name must contain only letters and spaces");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Please enter a valid email address");
    }
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    
    return errors;
}

function handleError(error) {
    console.error('Firebase error:', error);
    const errorCode = error.code;
    const errorMessage = error.message;
    
    let alertMessage = 'An error occurred.';
    switch (errorCode) {
        case 'auth/email-already-in-use':
            alertMessage = 'This email address is already registered.';
            break;
        case 'auth/invalid-email':
            alertMessage = 'Invalid email format.';
            break;
        case 'auth/user-disabled':
            alertMessage = 'This account has been disabled.';
            break;
        case 'auth/user-not-found':
            alertMessage = 'User not found.';
            break;
        case 'auth/wrong-password':
            alertMessage = 'Incorrect password.';
            break;
        default:
            alertMessage = errorMessage;
    }
    
    alert(alertMessage);
}

function setLoadingState(isLoading) {
    const loginButton = document.querySelector('#loginForm button[type="submit"]');
    const registerButton = document.querySelector('#registerForm button[type="submit"]');
    
    if (isLoading) {
        loginButton?.setAttribute('disabled', 'disabled');
        registerButton?.setAttribute('disabled', 'disabled');
    } else {
        loginButton?.removeAttribute('disabled');
        registerButton?.removeAttribute('disabled');
    }
}