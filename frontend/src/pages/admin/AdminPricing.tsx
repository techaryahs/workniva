import { useState, useEffect } from 'react';
import { getPricing, updatePricing } from '../../services/adminService';
import type { PricingItem } from '../../services/adminService';
import { Button } from '../../components/ui/Button';

const AdminPricing = () => {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  const fetchPricing = async () => {
    setPricing(await getPricing());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPricing();
  }, []);


  const handleSave = async (id: string) => {
    await updatePricing(id, { price: parseInt(editPrice) });
    setEditingId(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPricing();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updatePricing(id, { isActive: !current });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPricing();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pricing Management</h1>
          <p className="text-slate-500">Configure rates for different booking durations.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {pricing.map(item => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                  <span className="text-xs text-slate-500 uppercase font-medium">{item.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">₹</span>
                    <input 
                      type="number" 
                      className="w-24 p-2 border border-slate-300 rounded text-right"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                    />
                    <Button size="sm" onClick={() => handleSave(item.id)}>Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-slate-800 w-24 text-right">₹{item.price}</div>
                    <Button variant="outline" size="sm" onClick={() => { setEditingId(item.id); setEditPrice(item.price.toString()); }}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(item.id, item.isActive)}>
                      {item.isActive ? 'Disable' : 'Enable'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;
