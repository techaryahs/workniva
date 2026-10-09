const fs = require('fs');

let appContent = fs.readFileSync('frontend/src/App.tsx', 'utf8');
if (!appContent.includes('AdminNotifications')) {
  appContent = appContent.replace(/import AdminAvailability from '\.\/pages\/admin\/AdminAvailability';/, `import AdminAvailability from './pages/admin/AdminAvailability';\nimport AdminNotifications from './pages/admin/AdminNotifications';`);
  appContent = appContent.replace(/<Route path="availability" element=\{<AdminAvailability \/>\} \/>/, `<Route path="availability" element={<AdminAvailability />} />\n            <Route path="notifications" element={<AdminNotifications />} />`);
  fs.writeFileSync('frontend/src/App.tsx', appContent);
}

let layoutContent = fs.readFileSync('frontend/src/layouts/AdminLayout.tsx', 'utf8');
if (!layoutContent.includes('Bell')) {
  layoutContent = layoutContent.replace(/import \{[\s\S]*?\} from 'lucide-react';/, `import { Users, CalendarDays, LayoutDashboard, Settings, CreditCard, Clock, LogOut, Menu, X, Bell } from 'lucide-react';`);
  layoutContent = layoutContent.replace(/\{ name: 'Pricing', icon: CreditCard, path: '\/admin\/pricing' \},/, `{ name: 'Pricing', icon: CreditCard, path: '/admin/pricing' },\n  { name: 'Notifications', icon: Bell, path: '/admin/notifications' },`);
  fs.writeFileSync('frontend/src/layouts/AdminLayout.tsx', layoutContent);
}
