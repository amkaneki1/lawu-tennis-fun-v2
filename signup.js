// signup.js
// Handles user registration on the signup page using username and phone number.

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to home
  const currentUser = localStorage.getItem('lawuTennisCurrentUser');
  if (currentUser) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!name || !username || !phone || !password) {
      alert('Please complete all fields.');
      return;
    }
    // When registering a user, pass phone number along with full name
    const err = registerUser(username, password, { fullName: name, phone });
    if (err) {
      alert(err);
      return;
    }
    // Automatically log in the user
    loginUser(username, password);
    alert('Registration successful! Welcome to Lawu Tennis Fun.');
    window.location.href = 'index.html';
  });
});