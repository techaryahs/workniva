const fs = require('fs');
let content = fs.readFileSync('backend/src/routes/adminRoutes.ts', 'utf8');

if (!content.includes('import { Router }')) {
  content = "import { Router } from 'express';\nimport { requireAuth, requireAdmin } from '../middleware/authMiddleware';\n" + content;
}
fs.writeFileSync('backend/src/routes/adminRoutes.ts', content);
