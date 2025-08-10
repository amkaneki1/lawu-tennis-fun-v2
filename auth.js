// auth.js
// Contains helper functions for authentication and session management.

/**
 * Ensures a user is currently logged in. If not, redirects to the login page.
 * @returns {string|null} The email of the current user if logged in, otherwise null.
 */
function requireLogin() {
  const currentUser = localStorage.getItem('lawuTennisCurrentUser');
  if (!currentUser) {
    // Preserve the intended destination (except for login and signup pages)
    const currentPath = window.location.pathname.split('/').pop();
    if (!['login.html', 'signup.html', 'reset_password.html'].includes(currentPath)) {
      window.location.href = 'login.html';
    }
    return null;
  }
  return currentUser;
}

/**
 * Registers a new user in localStorage. Returns an error message if the email is
 * already taken, or null on success.
 * @param {string} email
 * @param {string} password
 * @param {Object} profileData Additional profile information (e.g. fullName).
 */
function registerUser(email, password, profileData = {}) {
  const users = JSON.parse(localStorage.getItem('lawuTennisUsers')) || [];
  if (users.some(u => u.email === email)) {
    return 'An account with this email already exists.';
  }
  // Add the new user. Store only email and password here; admin flag is stored on the profile.
  users.push({ email, password });
  localStorage.setItem('lawuTennisUsers', JSON.stringify(users));
  // Save profile data for this user
  const existingProfiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
  existingProfiles[email] = {
    email,
    fullName: profileData.fullName || '',
    phone: profileData.phone || '',
    instagram: profileData.instagram || '',
    birthDate: profileData.birthDate || '',
    gender: profileData.gender || '',
    notes: profileData.notes || '',
    // isAdmin flag allows certain accounts to access admin features
    isAdmin: !!profileData.isAdmin
  };
  localStorage.setItem('lawuTennisProfiles', JSON.stringify(existingProfiles));
  return null;
}

/**
 * Attempts to log in a user with the given email and password. If successful,
 * sets the current user and loads their profile. Returns an error message on
 * failure, or null on success.
 * @param {string} email
 * @param {string} password
 */
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('lawuTennisUsers')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return 'Invalid email or password.';
  }
  localStorage.setItem('lawuTennisCurrentUser', email);
  // Set profile for convenience (copy from profiles collection)
  const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
  const profile = profiles[email] || { email, fullName: '' };
  localStorage.setItem('lawuTennisProfile', JSON.stringify(profile));
  return null;
}

/**
 * Logs out the current user. Clears only the current session and profile from
 * localStorage, not the bookings, packages or transactions (which contain
 * user email fields to filter by).
 */
function logoutUser() {
  localStorage.removeItem('lawuTennisCurrentUser');
  localStorage.removeItem('lawuTennisProfile');
}

/**
 * Resets the password for a user. Returns an error message if the account
 * does not exist; otherwise updates the password.
 * @param {string} email
 * @param {string} newPassword
 */
function resetPassword(email, newPassword) {
  const users = JSON.parse(localStorage.getItem('lawuTennisUsers')) || [];
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) {
    return 'Account not found for the given email.';
  }
  users[idx].password = newPassword;
  localStorage.setItem('lawuTennisUsers', JSON.stringify(users));
  return null;
}

/**
 * Ensures the current user has admin privileges. If not, redirects to the home
 * page. Returns the email of the current user if they are an admin; otherwise
 * null.
 */
function requireAdmin() {
  const currentUser = requireLogin();
  if (!currentUser) {
    return null;
  }
  const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
  const profile = profiles[currentUser];
  if (!profile || !profile.isAdmin) {
    // Not an admin – redirect to home page
    window.location.href = 'index.html';
    return null;
  }
  return currentUser;
}

/*
 * Seed the built‑in admin account if it does not already exist. This code runs
 * immediately when this file is loaded. The admin credentials are defined
 * inline for demonstration purposes: user = dhuha@gmail.com, password = dhuha.
 */
(function seedAdminAccount() {
  const adminEmail = 'dhuha@gmail.com';
  const adminPassword = 'dhuha';
  // Load existing users and profiles
  const users = JSON.parse(localStorage.getItem('lawuTennisUsers')) || [];
  const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
  const hasAdminUser = users.some(u => u.email === adminEmail);
  if (!hasAdminUser) {
    // Add to users list
    users.push({ email: adminEmail, password: adminPassword });
    localStorage.setItem('lawuTennisUsers', JSON.stringify(users));
  }
  // Ensure admin profile exists and has isAdmin flag
  if (!profiles[adminEmail]) {
    profiles[adminEmail] = {
      email: adminEmail,
      fullName: 'Admin',
      phone: '',
      instagram: '',
      birthDate: '',
      gender: '',
      notes: '',
      isAdmin: true
    };
  } else {
    profiles[adminEmail].isAdmin = true;
  }
  localStorage.setItem('lawuTennisProfiles', JSON.stringify(profiles));
})();