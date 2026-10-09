const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/MyBookingsPage.tsx', 'utf8');

// Insert retry logic
content = content.replace(/const handleCancel = async \(id: string\) => \{/, `
  const handleRetryPayment = async (booking: Booking) => {
    try {
      const { createPaymentOrder, verifyPayment } = await import('../services/paymentApi');
      const order = await createPaymentOrder(booking.id);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "RentOffice",
        description: "Booking Payment Retry",
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              ...response,
              booking_id: booking.id
            });
            alert("Payment successful!");
            loadBookings();
          } catch (verifyErr) {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: booking.customer.fullName,
          email: booking.customer.email,
          contact: booking.customer.mobile
        },
        theme: {
          color: "#2563EB"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Could not retry payment.");
    }
  };

  const handleCancel = async (id: string) => {`);

// Update button onClick
content = content.replace(/alert\("Please initiate a new booking flow for now, or retry payment feature coming soon."\);/g, "handleRetryPayment(booking);");

fs.writeFileSync('frontend/src/pages/MyBookingsPage.tsx', content);
