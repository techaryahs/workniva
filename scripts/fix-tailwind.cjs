const fs = require('fs');

let config = fs.readFileSync('frontend/tailwind.config.js', 'utf8');

if (!config.includes('warm-ivory')) {
  config = config.replace(/extend: \{/, `extend: {
      colors: {
        'warm-ivory': '#FAFAF8',
        'deep-charcoal': '#1C1F22',
        'deep-forest': '#233224',
        'terracotta': '#C8684C',
        'muted-sage': '#9FB29F',
        'soft-beige': '#E8E5E1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
      },`);
  fs.writeFileSync('frontend/tailwind.config.js', config);
}

let html = fs.readFileSync('frontend/index.html', 'utf8');
if (!html.includes('DM+Serif+Display')) {
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;500;600;700\&display=swap" rel="stylesheet">/, `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet">`);
  fs.writeFileSync('frontend/index.html', html);
}

