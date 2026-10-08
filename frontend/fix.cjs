const fs = require('fs');
let content = fs.readFileSync('src/pages/BookingPage.tsx', 'utf8');

const regex = /const handleConfirm = async \(\) => \{[\s\S]*?\};\n\n      await saveBooking\(newBooking\);[\s\S]*?  \};\n/g;

content = content.replace(regex, `const handleConfirm = async () => {
    if (!state.date || !state.timeSlot || !state.duration || !state.customer) return;
    if (!isAuthenticated) {
      alert("Please log in to confirm your booking.");
      navigate("/login", { state: { from: { pathname: "/booking" } } });
      return;
    }
    setIsConfirming(true);
    try {
      const amount = getPrice(state.duration);
      const startHour = parseInt(state.timeSlot);
      let hours = 1;
      if (state.duration.includes("Hour")) hours = parseInt(state.duration);
      if (state.duration === "Half Day") hours = 4;
      if (state.duration === "Full Day" || state.duration === "Night") hours = 8;
      const endHour = startHour + hours;
      const endTime = \`\${endHour.toString().padStart(2, "0")}:00\`;

      const newBooking = await createBooking({
        date: format(state.date, "yyyy-MM-dd"),
        startTime: state.timeSlot,
        endTime,
        duration: state.duration,
        guests: state.guests,
        customer: state.customer,
        purpose: state.customer.purpose as BookingPurpose,
        specialRequirements: state.customer.specialRequirements,
        amount,
        status: "Confirmed"
      });

      navigate("/booking/confirmation", { state: { booking: newBooking } });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsConfirming(false);
    }
  };\n`);
fs.writeFileSync('src/pages/BookingPage.tsx', content);
