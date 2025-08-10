// resetPassword.js
// Handles resetting password for a user.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const newPass = document.getElementById('resetPassword').value;
    if (!email || !newPass) {
      alert('Please enter both email and new password.');
      return;
    }
    const err = resetPassword(email, newPass);
    if (err) {
      alert(err);
      return;
    }
    alert('Password reset successful! You can now log in with your new password.');
    window.location.href = 'login.html';
  });
});