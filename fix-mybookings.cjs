const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/MyBookingsPage.tsx', 'utf8');

// Replace {booking.status === 'Confirmed' && (
content = content.replace(/\{booking\.status === 'Confirmed' && \(/g, `{booking.status === 'Pending_payment' && (
                  <button
                    onClick={() => {
                      alert("Please initiate a new booking flow for now, or retry payment feature coming soon.");
                    }}
                    className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Complete Payment
                  </button>
                )}
                {booking.status === 'Confirmed' && (`);

fs.writeFileSync('frontend/src/pages/MyBookingsPage.tsx', content);
