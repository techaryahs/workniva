const fs = require('fs');
let content = fs.readFileSync('src/pages/BookingPage.tsx', 'utf8');
content = content.replace(/state\.duration \/\* eslint-disable-line \*\/ as any/g, 'state.duration');
content = content.replace(/checkAvailability\(\s*format\(state\.date, 'yyyy-MM-dd'\),\s*state\.timeSlot,\s*state\.duration\s*\)/g, "checkAvailability(format(state.date, 'yyyy-MM-dd'), state.timeSlot)");
fs.writeFileSync('src/pages/BookingPage.tsx', content);
