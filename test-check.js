async function test() {
  try {
    const res = await fetch('http://localhost:5080/api/bookings/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: '2026-10-15',
        startTime: '10:00',
        duration: '4 Hours',
        guests: 5,
        workspace: 'private-cabin'
      })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch(e) {
    console.log(e);
  }
}
test();
