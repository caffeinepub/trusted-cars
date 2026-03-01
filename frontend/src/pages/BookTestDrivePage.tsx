import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Calendar, Clock, User, Phone, Mail, Car, CheckCircle, Loader2 } from 'lucide-react';
import { useGetCars, useAddBooking } from '../hooks/useQueries';

const TIME_SLOTS = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

interface FormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  carId: string;
}

const defaultForm: FormData = {
  name: '',
  phone: '',
  email: '',
  date: '',
  timeSlot: '',
  carId: '',
};

export default function BookTestDrivePage() {
  const search = useSearch({ strict: false }) as { carId?: string };
  const { data: cars } = useGetCars();
  const addBooking = useAddBooking();

  const [form, setForm] = useState<FormData>({ ...defaultForm, carId: search?.carId || '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (search?.carId) {
      setForm((f) => ({ ...f, carId: search.carId || '' }));
    }
  }, [search?.carId]);

  const today = new Date().toISOString().split('T')[0];

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!form.date) newErrors.date = 'Please select a date';
    if (!form.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCar = cars?.find((c) => String(Number(c.id)) === form.carId);

    try {
      await addBooking.mutateAsync({
        id: BigInt(0),
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        carId: selectedCar ? selectedCar.id : BigInt(0),
        date: form.date,
        timeSlot: form.timeSlot,
        status: 'Pending',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors ${
      errors[field] ? 'border-brand-red' : 'border-brand-gray-mid'
    }`;

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-black mb-3">Booking Confirmed!</h2>
          <p className="text-brand-gray-dark text-base mb-2">
            Your test drive has been booked! We will contact you shortly.
          </p>
          <p className="text-brand-gray-dark text-sm mb-8">
            Our team will call you at <strong>{form.phone}</strong> to confirm your appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm(defaultForm); }}
              className="bg-brand-red text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
            >
              Book Another
            </button>
            <a
              href="tel:+919582149643"
              className="border-2 border-brand-black text-brand-black px-6 py-2.5 rounded font-semibold text-sm hover:bg-brand-black hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray min-h-screen">
      {/* Header */}
      <div className="bg-brand-black py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-1">Schedule</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Book a Test Drive</h1>
          <p className="text-white/60 text-sm mt-2">Fill in your details and we'll confirm your slot</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-card border border-brand-gray-mid p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className={`${inputClass('name')} pl-10`}
                />
              </div>
              {errors.name && <p className="text-brand-red text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">
                Phone Number <span className="text-brand-red">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="Enter your 10-digit mobile number"
                  className={`${inputClass('phone')} pl-10`}
                />
              </div>
              {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">
                Email Address <span className="text-brand-gray-dark text-xs">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className={`${inputClass('email')} pl-10`}
                />
              </div>
            </div>

            {/* Car Selection */}
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1.5">
                Select Car <span className="text-brand-gray-dark text-xs">(optional)</span>
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                <select
                  value={form.carId}
                  onChange={(e) => setForm((f) => ({ ...f, carId: e.target.value }))}
                  className="w-full border border-brand-gray-mid rounded pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors appearance-none bg-white"
                >
                  <option value="">Any car / Not sure yet</option>
                  {cars?.filter((c) => c.status === 'Available').map((car) => (
                    <option key={Number(car.id)} value={String(Number(car.id))}>
                      {car.brand} {car.model} ({Number(car.year)}) — ₹{Number(car.price).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Preferred Date <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                  <input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={`${inputClass('date')} pl-10`}
                  />
                </div>
                {errors.date && <p className="text-brand-red text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-1.5">
                  Preferred Time <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))}
                    className={`${inputClass('timeSlot')} pl-10 appearance-none`}
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                {errors.timeSlot && <p className="text-brand-red text-xs mt-1">{errors.timeSlot}</p>}
              </div>
            </div>

            {/* Error from mutation */}
            {addBooking.isError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-brand-red">
                Something went wrong. Please try again or call us at +91 9582149643.
              </div>
            )}

            <button
              type="submit"
              disabled={addBooking.isPending}
              className="w-full bg-brand-red text-white py-3.5 rounded font-bold text-base hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {addBooking.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Test Drive Booking'
              )}
            </button>

            <p className="text-center text-xs text-brand-gray-dark">
              Or call us directly at{' '}
              <a href="tel:+919582149643" className="text-brand-red font-semibold">
                +91 9582149643
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
