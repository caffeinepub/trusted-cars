import { useState } from 'react';
import { X, Phone, User, CheckCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  carTitle?: string;
}

export default function EnquiryModal({ isOpen, onClose, carTitle }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(phone.trim())) newErrors.phone = 'Enter a valid 10-digit mobile number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-brand-gray-mid">
          <h2 className="font-display font-bold text-xl text-brand-black">Enquire Now</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-gray transition-colors"
          >
            <X className="w-4 h-4 text-brand-gray-dark" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-brand-black mb-2">Thank You!</h3>
              <p className="text-brand-gray-dark text-sm">
                We've received your enquiry for <strong>{carTitle}</strong>. Our team will contact you shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 bg-brand-red text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {carTitle && (
                <p className="text-sm text-brand-gray-dark bg-brand-gray px-3 py-2 rounded">
                  Enquiring about: <strong className="text-brand-black">{carTitle}</strong>
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Your Name <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors ${
                      errors.name ? 'border-brand-red' : 'border-brand-gray-mid'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-brand-red text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Phone Number <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors ${
                      errors.phone ? 'border-brand-red' : 'border-brand-gray-mid'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-brand-red text-white py-3 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
              >
                Submit Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
