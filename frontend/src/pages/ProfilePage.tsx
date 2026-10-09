import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { User, Mail, Phone, Building2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../services/api';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    if (authProfile) {
      setFormData({
        full_name: authProfile.full_name || '',
        phone: authProfile.phone || '',
        company: authProfile.company || ''
      });
    }
  }, [authProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await fetchApi('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setSuccessMsg('Profile updated successfully.');
      await refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/profile',
      });
      if (error) throw error;
      setSuccessMsg('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 mt-16 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
              <p className="text-slate-500 mt-1">Manage your personal information and account settings.</p>
            </div>
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
              <User size={32} />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{successMsg}</p>
              </div>
            )}
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building2 size={18} />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Security</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-medium text-slate-800">Password</p>
                  <p className="text-sm text-slate-500">Receive an email link to reset your password.</p>
                </div>
                <button 
                  onClick={handlePasswordReset}
                  className="mt-3 sm:mt-0 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Workspace Reservations</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div>
                  <p className="font-medium text-blue-900">My Bookings</p>
                  <p className="text-sm text-blue-700">View your upcoming, completed, and cancelled bookings.</p>
                </div>
                <button 
                  onClick={() => navigate('/my-bookings')}
                  className="mt-3 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
