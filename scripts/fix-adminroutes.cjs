const fs = require('fs');
let content = fs.readFileSync('backend/src/routes/adminRoutes.ts', 'utf8');

content = content.replace(/import \{[\s\S]*?\} from '\.\.\/controllers\/adminController';/, `import {\n  getBookings,\n  updateBookingStatus,\n  getPricing,\n  updatePricing,\n  getBlockedTimes,\n  blockTime,\n  unblockTime,\n  getCustomers\n} from '../controllers/adminController';\nimport { getNotifications, retryNotification } from '../controllers/notificationController';`);

content += `\nrouter.get('/notifications', getNotifications);\nrouter.post('/notifications/:id/retry', retryNotification);\n`;

fs.writeFileSync('backend/src/routes/adminRoutes.ts', content);
