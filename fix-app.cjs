const fs = require('fs');
let content = fs.readFileSync('backend/src/app.ts', 'utf8');

content = content.replace(/import cors from 'cors';/, `import cors from 'cors';\nimport helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';`);

const middleware = `
app.use(helmet());
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json({ limit: '10kb' })); // Request size limit

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);
`;

content = content.replace(/app\.use\(cors\(\{ origin: config\.frontendUrl \}\)\);\napp\.use\(express\.json\(\)\);/, middleware);

fs.writeFileSync('backend/src/app.ts', content);
