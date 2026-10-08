const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/BookingPage.tsx', 'utf8');

// replace handleConfirm block
const regex = /const handleConfirm = async \(\) => \{[\s\S]*?\};\n\n  const steps/g;
content = content.replace(regex, `const handleConfirm = async () => {
    if (!state.date || !state.timeSlot || !state.duration || !state.customer) return;
    
    if (!isAuthenticated) {
      alert("Please log in to confirm your booking.");
      navigate("/login", { state: { from: { pathname: "/booking" } } });
      return;
    }
    
    setIsConfirming(true);
    try {
      // 1. Create booking (backend sets status = pending_payment)
      const newBooking = await createBooking({
        date: format(state.date, 'yyyy-MM-dd'),
        startTime: state.timeSlot,
        endTime: "00:00:00", // backend calculates this
        duration: state.duration,
        guests: state.guests,
        customer: state.customer,
        purpose: state.customer.purpose as BookingPurpose,
        specialRequirements: state.customer.specialRequirements,
        amount: 0, // backend calculates
        status: 'Pending_payment' as any
      });

      // 2. Create Razorpay order
      const { createPaymentOrder, verifyPayment } = await import('../services/paymentApi');
      const order = await createPaymentOrder(newBooking.id);

      // 3. Open Razorpay Checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "RentOffice",
        description: "Booking Payment",
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            const confirmedBooking = await verifyPayment({
              ...response,
              booking_id: newBooking.id
            });
            navigate('/booking/confirmation', { state: { booking: confirmedBooking } });
          } catch (verifyErr: any) {
            alert("Payment verification failed. Please try again or contact support.");
            navigate('/my-bookings');
          }
        },
        prefill: {
          name: state.customer.fullName,
          email: state.customer.email,
          contact: state.customer.mobile
        },
        theme: {
          color: "#2563EB"
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled.");
            navigate('/my-bookings');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
        navigate('/my-bookings');
      });
      rzp.open();

    } catch (err: any) {
      alert(err.message);
      setIsConfirming(false);
    }
  };

  const steps`);

fs.writeFileSync('frontend/src/pages/BookingPage.tsx', content);
