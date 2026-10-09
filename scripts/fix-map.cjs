const fs = require('fs');
let content = fs.readFileSync('frontend/src/services/bookingService.ts', 'utf8');

content = content.replace(/status: row.status.charAt\(0\).toUpperCase\(\) \+ row.status.slice\(1\) as Booking\['status'\],/g, `status: (row.status === 'pending_payment' ? 'Pending_payment' : row.status.charAt(0).toUpperCase() + row.status.slice(1)) as Booking['status'],`);

fs.writeFileSync('frontend/src/services/bookingService.ts', content);
