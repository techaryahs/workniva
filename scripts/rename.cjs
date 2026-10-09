const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/RentOffice/g, 'You Work').replace(/rentoffice/g, 'youwork');
  // Revert whatsapp template name if affected
  newContent = newContent.replace(/youwork_booking_confirmed/g, 'rentoffice_booking_confirmed');
  newContent = newContent.replace(/youwork_notification/g, 'rentoffice_notification');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (['.ts', '.tsx', '.html', '.js'].includes(path.extname(fullPath))) {
         replaceInFile(fullPath);
      }
    }
  }
}

walkDir('frontend/src');
walkDir('backend/src');
replaceInFile('frontend/index.html');
