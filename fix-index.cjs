const fs = require('fs');
let content = fs.readFileSync('frontend/index.html', 'utf8');

const metaTags = `
    <meta name="description" content="RentOffice provides premium, on-demand professional workspaces and meeting rooms." />
    <meta property="og:title" content="RentOffice — Premium Workspaces" />
    <meta property="og:description" content="Book professional meeting rooms and office spaces on demand." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://rentoffice.example.com/" />
`;

content = content.replace(/<title>.*?<\/title>/, `<title>RentOffice — Premium Workspaces</title>\n${metaTags}`);

fs.writeFileSync('frontend/index.html', content);
