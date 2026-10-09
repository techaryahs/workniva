const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 5080,
  path: '/api/bookings/availability',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    console.log("BODY:", data);
  });
});
req.write(JSON.stringify({
  date: "2026-10-15",
  startTime: "10:00",
  duration: "4 Hours",
  guests: 5,
  workspace: "private-cabin"
}));
req.end();
