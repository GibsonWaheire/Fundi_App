document.addEventListener("DOMContentLoaded", () => {
  // ===== SELECT ELEMENTS =====
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const getStartedBtns = document.querySelectorAll('#getStartedBtn');

  // ===== SHOW MODALS =====
  loginBtn?.addEventListener('click', () => loginSection?.classList.remove('hidden'));
  registerBtn?.addEventListener('click', () => registerSection?.classList.remove('hidden'));
  getStartedBtns?.forEach(btn => {
    btn.addEventListener('click', () => loginSection?.classList.remove('hidden'));
  });

  // ===== SWITCH FORMS =====
  window.switchToRegister = function () {
    loginSection?.classList.add('hidden');
    registerSection?.classList.remove('hidden');
  };

  window.switchToLogin = function () {
    registerSection?.classList.add('hidden');
    loginSection?.classList.remove('hidden');
  };

  // ===== CLOSE ON OUTSIDE CLICK =====
  window.addEventListener('click', (e) => {
    if (e.target === loginSection) loginSection?.classList.add('hidden');
    if (e.target === registerSection) registerSection?.classList.add('hidden');
  });

  // ===== REGISTER FORM SUBMISSION =====
  document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.toLowerCase();
    const password = document.getElementById('registerPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      alert("User with this email already exists.");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Account created successfully! You can now log in.");
    document.getElementById('registerForm').reset();
    switchToLogin();
  });

  // ===== LOGIN FORM SUBMISSION =====
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (!matchedUser) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
    alert(`Welcome back, ${matchedUser.name}!`);
    window.location.href = "dashboard.html";
  });
});
