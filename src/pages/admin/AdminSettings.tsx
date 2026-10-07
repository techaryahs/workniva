import { Button } from '../../components/ui/Button';

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your You Work configuration.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Business Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input type="text" defaultValue="You Work Prime" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" defaultValue="hello@youwork.example.com" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" defaultValue="+91 98765 43210" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Office Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Office Address</label>
            <textarea defaultValue="123 Business Avenue, Tech District, City" rows={2} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Capacity</label>
            <input type="number" defaultValue={10} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Booking Settings</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Min Duration (Hours)</label>
            <input type="number" defaultValue={1} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Duration (Hours)</label>
            <input type="number" defaultValue={8} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Advance Booking (Days)</label>
            <input type="number" defaultValue={30} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
