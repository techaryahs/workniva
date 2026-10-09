import React, { useState } from 'react';
import type { CustomerDetails, BookingPurpose } from '../../types/booking';
import { Button } from '../ui/Button';

interface CustomerDetailsFormProps {
  initialData?: CustomerDetails;
  onSubmit: (data: CustomerDetails) => void;
  onBack: () => void;
}

const PURPOSES: BookingPurpose[] = [
  'Client Meeting',
  'Business Meeting',
  'Team Meeting',
  'Interview',
  'Presentation',
  'Online Meeting',
  'Remote Work',
  'Training',
  'Other',
];

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<CustomerDetails>(initialData || {
    fullName: '',
    email: '',
    mobile: '',
    company: '',
    purpose: '',
    specialRequirements: '',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || initialData.fullName || '',
        email: prev.email || initialData.email || '',
        mobile: prev.mobile || initialData.mobile || '',
        company: prev.company || initialData.company || ''
      }));
    }
  }, [initialData]);
  
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Valid email is required.';
    if (!formData.mobile.trim() || formData.mobile.length < 5) newErrors.mobile = 'Valid mobile number is required.';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CustomerDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Customer Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input 
            type="text" 
            className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`}
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
          <input 
            type="email" 
            className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
          <input 
            type="tel" 
            className={`w-full p-3 rounded-lg border ${errors.mobile ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`}
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company / Organization</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Booking *</label>
          <select 
            className={`w-full p-3 rounded-lg border bg-white ${errors.purpose ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} outline-none transition-all`}
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
          >
            <option value="" disabled>Select a purpose...</option>
            {PURPOSES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Special Requirements</label>
          <textarea 
            rows={3}
            className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            value={formData.specialRequirements}
            onChange={(e) => handleChange('specialRequirements', e.target.value)}
            placeholder="Any specific setup or needs?"
          />
        </div>
      </div>
      
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/3">Back</Button>
        <Button type="submit" className="w-2/3">Continue to Review</Button>
      </div>
    </form>
  );
};
