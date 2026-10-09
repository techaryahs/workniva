const fs = require('fs');
let content = fs.readFileSync('backend/src/routes/paymentRoutes.ts', 'utf8');

content = content.replace(/import \{ createOrder, verifyPayment, getPayment \} from '\.\.\/controllers\/paymentController';/, `import { createOrder, verifyPayment, getPayment, handleWebhook } from '../controllers/paymentController';`);

content = content.replace(/router\.use\(requireAuth\);/, `// Webhook doesn't require JWT auth\nrouter.post('/webhook', handleWebhook);`);

content = content.replace(/router\.post\('\/create-order', createOrder\);/, `router.post('/create-order', requireAuth, createOrder);`);
content = content.replace(/router\.post\('\/verify', verifyPayment\);/, `router.post('/verify', requireAuth, verifyPayment);`);
content = content.replace(/router\.get\('\/:bookingId', getPayment\);/, `router.get('/:bookingId', requireAuth, getPayment);`);

fs.writeFileSync('backend/src/routes/paymentRoutes.ts', content);
