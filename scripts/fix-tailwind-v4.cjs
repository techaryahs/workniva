const fs = require('fs');

let css = fs.readFileSync('frontend/src/index.css', 'utf8');

if (!css.includes('warm-ivory')) {
  css = css.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --color-warm-ivory: #FAFAF8;
  --color-deep-charcoal: #1C1F22;
  --color-deep-forest: #233224;
  --color-terracotta: #C8684C;
  --color-muted-sage: #9FB29F;
  --color-soft-beige: #E8E5E1;
  --font-display: 'DM Serif Display', serif;
  --font-sans: 'Inter', sans-serif;
}`);
  
  css = css.replace(/var\(--color-background\)/, `var(--color-warm-ivory)`);
  css = css.replace(/var\(--color-text\)/, `var(--color-deep-charcoal)`);

  fs.writeFileSync('frontend/src/index.css', css);
}

let html = fs.readFileSync('frontend/index.html', 'utf8');
if (!html.includes('DM+Serif+Display')) {
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;500;600;700\&display=swap" rel="stylesheet">/, `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet">`);
  fs.writeFileSync('frontend/index.html', html);
}
