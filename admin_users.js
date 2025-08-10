// admin_users.js
// Handles user listing for the admin panel

document.addEventListener('DOMContentLoaded', () => {
  // Ensure only admin can access this page
  const adminUser = requireAdmin();
  if (!adminUser) return;
  const tbody = document.getElementById('usersBody');
  const addBtn = document.getElementById('addUserBtn');
  const formContainer = document.getElementById('addUserFormContainer');
  const addForm = document.getElementById('addUserForm');

  /**
   * Renders the list of registered users into the table body. Reads from
   * localStorage each time so that newly added users appear immediately.
   */
  function renderUsers() {
    const profiles = JSON.parse(localStorage.getItem('lawuTennisProfiles')) || {};
    tbody.innerHTML = '';
    Object.keys(profiles).forEach(email => {
      const prof = profiles[email];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="border:1px solid #ddd;padding:8px;">${prof.fullName || ''}</td>
        <td style="border:1px solid #ddd;padding:8px;">${prof.email}</td>
        <td style="border:1px solid #ddd;padding:8px;">${prof.phone || ''}</td>
        <td style="border:1px solid #ddd;padding:8px;">${prof.isAdmin ? 'Admin' : 'User'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderUsers();

  // Toggle the visibility of the add user form when the button is clicked
  addBtn?.addEventListener('click', () => {
    if (!formContainer) return;
    const visible = formContainer.style.display !== 'none';
    formContainer.style.display = visible ? 'none' : 'block';
  });

  // Handle submission of the add user form
  addForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fullName = document.getElementById('newUserFullName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim().toLowerCase();
    const phone = document.getElementById('newUserPhone').value.trim();
    const password = document.getElementById('newUserPassword').value;
    if (!fullName || !email || !password) {
      alert('Nama lengkap, email, dan password wajib diisi.');
      return;
    }
    // Attempt to register the new user. Ensure isAdmin false so the user
    // becomes a standard customer.
    const err = registerUser(email, password, { fullName: fullName, phone: phone, isAdmin: false });
    if (err) {
      alert(err);
      return;
    }
    // Clear form and hide it
    addForm.reset();
    formContainer.style.display = 'none';
    // Refresh the user list
    renderUsers();
    alert('Pengguna baru berhasil ditambahkan.');
  });
});