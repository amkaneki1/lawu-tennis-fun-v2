// resetPassword.js
// Handles resetting password for a user using the username.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('resetUsername').value.trim();
    const newPass = document.getElementById('resetPassword').value;
    if (!username || !newPass) {
      alert('Please enter both username and new password.');
      return;
    }
    const err = resetPassword(username, newPass);
    if (err) {
      alert(err);
      return;
    }
    alert('Password reset successful! You can now log in with your new password.');
    window.location.href = 'login.html';
  });
});