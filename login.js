// login.js
// Handles user login on the login page.

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to home
  const currentUser = localStorage.getItem('lawuTennisCurrentUser');
  if (currentUser) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    const err = loginUser(email, password);
    if (err) {
      alert(err);
      return;
    }
    // Successful login
    alert('Login successful!');
    // Redirect to home page
    window.location.href = 'index.html';
  });
});