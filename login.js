// login.js
// Handles user login on the login page using usernames.

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
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    const err = loginUser(username, password);
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