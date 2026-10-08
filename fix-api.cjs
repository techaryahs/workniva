const fs = require('fs');
let content = fs.readFileSync('frontend/src/services/api.ts', 'utf8');

content = content.replace(/const headers: Record<string, string> = \{[\s\S]*?\};/m, `const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };`);

fs.writeFileSync('frontend/src/services/api.ts', content);
