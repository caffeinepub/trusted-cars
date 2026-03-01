import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Mail, Lock, Loader2, AlertCircle, Car } from 'lucide-react';
import { useAdminLogin } from '../../hooks/useQueries';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const adminLogin = useAdminLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') {
      navigate({ to: '/admin/dashboard' });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await adminLogin.mutateAsync({ email, password });
      if (success) {
        localStorage.setItem('isAdmin', 'true');
        navigate({ to: '/admin/dashboard' });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-brand-black">
              Trusted<span className="text-brand-red">Cars</span>
            </span>
          </div>
          <p className="text-brand-gray-dark text-sm">Admin Panel</p>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-brand-gray-mid p-8">
          <h1 className="font-display font-bold text-xl text-brand-black mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@usedcars.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-mid rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-mid rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-brand-red">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={adminLogin.isPending}
              className="w-full bg-brand-red text-white py-3 rounded font-bold text-sm hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {adminLogin.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
