// home.js
// This script populates the summary information on the home page for bookings and waiting list.

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = requireLogin();
  if (!currentUser) return;
  const bookingsSummaryEl = document.getElementById('bookingsSummary');
  const promosSummaryEl = document.getElementById('promosSummary');
  // Retrieve bookings from localStorage; supports both array and legacy object formats.
  const rawBookings = JSON.parse(localStorage.getItem('lawuTennisBookings')) || [];
  let bookingsArr;
  if (Array.isArray(rawBookings)) {
    bookingsArr = rawBookings;
  } else {
    // Convert legacy to array
    bookingsArr = [];
    Object.keys(rawBookings).forEach(date => {
      (rawBookings[date] || []).forEach(item => {
        if (typeof item === 'string') {
          bookingsArr.push({ date, time: item, userEmail: currentUser });
        } else {
          bookingsArr.push({ date, time: item.time, userEmail: item.userEmail || currentUser });
        }
      });
    });
    localStorage.setItem('lawuTennisBookings', JSON.stringify(bookingsArr));
  }
  let bookingCount = 0;
  bookingsArr.forEach(b => {
    if (!b.userEmail || b.userEmail === currentUser) bookingCount++;
  });
  if (bookingCount > 0) {
    bookingsSummaryEl.textContent = `You have ${bookingCount} upcoming booking${bookingCount > 1 ? 's' : ''}.`;
  } else {
    bookingsSummaryEl.textContent = 'No booking data available right now…';
  }
  // Retrieve promotions; for now promotions are static or stored under lawuTennisPromos.
  const promosData = JSON.parse(localStorage.getItem('lawuTennisPromos')) || [];
  if (promosData.length > 0) {
    promosSummaryEl.textContent = `We have ${promosData.length} promotion${promosData.length > 1 ? 's' : ''} available.`;
  } else {
    promosSummaryEl.textContent = 'There are currently no promotions.';
  }
});