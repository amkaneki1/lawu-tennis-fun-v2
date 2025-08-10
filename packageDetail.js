// packageDetail.js
// Displays the details of a selected package and handles checkout/purchase.
// Updated to use username instead of email when storing purchase and transaction data.

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const nameParam = decodeURIComponent(getQueryParam('name') || '');
  const titleEl = document.getElementById('packageTitle');
  const contentEl = document.getElementById('packageContent');
  const checkoutSection = document.getElementById('checkoutSection');
  const messageSection = document.getElementById('messageSection');
  const messageEl = document.getElementById('purchaseMessage');
  const checkoutBtn = document.getElementById('checkoutBtn');
  // Load package list from localStorage. If none, seed with default packages
  let packages = JSON.parse(localStorage.getItem('lawuTennisPackages')) || [];
  if (packages.length === 0) {
    packages = [
      { id: 'pkg-' + Date.now(), name: 'Single Session', price: 100000, expiry: 'Valid for 1 session', description: 'One practice session whenever you need a quick workout.', type: 'Public' },
      { id: 'pkg-' + (Date.now() + 1), name: 'Weekly Plan', price: 250000, expiry: 'Valid for 1 week (up to 3 sessions)', description: 'Up to 3 practice sessions per week to keep you fit and sharp.', type: 'Public' },
      { id: 'pkg-' + (Date.now() + 2), name: 'Monthly Membership', price: 900000, expiry: 'Valid for 1 month (unlimited sessions)', description: 'Unlimited sessions for a month—perfect for serious players.', type: 'Public' }
    ];
    localStorage.setItem('lawuTennisPackages', JSON.stringify(packages));
  }
  // Find the package by name
  const pkg = packages.find(p => p.name === nameParam);
  if (!pkg) {
    titleEl.textContent = 'Package Not Found';
    contentEl.innerHTML = '<p>The requested package could not be found.</p>';
    checkoutSection.style.display = 'none';
    return;
  }
  // Display package details
  titleEl.textContent = pkg.name;
  const priceText = 'Rp ' + pkg.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  contentEl.innerHTML = `
    <h2>${pkg.name}</h2>
    <p><strong>Price:</strong> ${priceText}</p>
    <p><strong>Expiry:</strong> ${pkg.expiry}</p>
    <p>${pkg.description}</p>
  `;
  // Check if already purchased by current user
  const purchased = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
  const alreadyPurchased = purchased.some(p => p.name === pkg.name && (!p.username || p.username === currentUser));
  if (alreadyPurchased) {
    messageEl.textContent = 'You have already purchased this package.';
    messageSection.style.display = 'block';
    checkoutSection.style.display = 'none';
  } else {
    checkoutSection.style.display = 'block';
    messageSection.style.display = 'none';
    checkoutBtn.addEventListener('click', () => {
      // Add package to purchased list for user
      const current = JSON.parse(localStorage.getItem('lawuTennisPurchasedPackages')) || [];
      current.push({ name: pkg.name, expiry: pkg.expiry, username: currentUser });
      localStorage.setItem('lawuTennisPurchasedPackages', JSON.stringify(current));
      // Create transaction object for payment with due date in 24 hours
      const transactions = JSON.parse(localStorage.getItem('lawuTennisTransactions')) || [];
      const transactionId = 'TX' + Date.now();
      const now = new Date();
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      transactions.push({
        id: transactionId,
        date: now.toISOString().slice(0, 10),
        item: pkg.name,
        price: priceText,
        status: 'Pending Payment',
        due: dueDate.toISOString(),
        type: 'package',
        username: currentUser
      });
      localStorage.setItem('lawuTennisTransactions', JSON.stringify(transactions));
      // Redirect to transaction detail page for payment proof upload
      window.location.href = 'transaction_detail.html?id=' + encodeURIComponent(transactionId);
    });
  }
});