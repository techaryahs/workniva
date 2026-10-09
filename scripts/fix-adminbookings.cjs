const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/admin/AdminBookings.tsx', 'utf8');

// add import getPaymentDetails
content = content.replace(/import \{ getAdminBookings, updateBookingStatus \} from '\.\.\/\.\.\/services\/adminService';/, `import { getAdminBookings, updateBookingStatus } from '../../services/adminService';\nimport { getPaymentDetails } from '../../services/paymentApi';`);

// add handleViewPayment
content = content.replace(/const handleStatusChange = async/, `const handleViewPayment = async (bookingId: string) => {
    try {
      const data = await getPaymentDetails(bookingId);
      if (!data) {
        alert("No payment records found for this booking.");
        return;
      }
      alert(\`Payment Status: \${data.status.toUpperCase()}\\nPayment ID: \${data.provider_payment_id || 'N/A'}\\nOrder ID: \${data.provider_order_id}\\nAmount: ₹\${data.amount}\\nProvider: \${data.provider}\`);
    } catch (err: any) {
      alert(err.message || "Could not load payment info.");
    }
  };

  const handleStatusChange = async`);

// add View Payment button
content = content.replace(/<button className="p-1\.5 text-slate-400 hover:bg-slate-100 rounded">/g, `<button onClick={() => handleViewPayment(b.id)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 mr-2">Payment Info</button>
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">`);

// add pending_payment to status color
content = content.replace(/b\.status === 'Confirmed' \? 'bg-green-100 text-green-700' : b\.status === 'Cancelled' \? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'/, `b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : b.status === 'Pending_payment' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'`);

// fix pending_payment in filter
content = content.replace(/<option value="Confirmed">Confirmed<\/option>/, `<option value="Confirmed">Confirmed</option>\n            <option value="Pending_payment">Pending Payment</option>`);


fs.writeFileSync('frontend/src/pages/admin/AdminBookings.tsx', content);
