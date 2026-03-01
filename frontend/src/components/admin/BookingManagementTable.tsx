import { useState } from 'react';
import { Download, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { useGetBookings, useUpdateBookingStatus, useGetCars } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import type { Booking } from '../../backend';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

function exportBookingsCSV(bookings: Booking[], carMap: Record<string, string>) {
  const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'Car', 'Date', 'Time Slot', 'Status'];
  const rows = bookings.map((b) => [
    String(Number(b.id)),
    b.customerName,
    b.phone,
    b.email,
    carMap[String(Number(b.carId))] || `Car #${Number(b.carId)}`,
    b.date,
    b.timeSlot,
    b.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trusted-cars-bookings-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-brand-red',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorMap[status] || 'bg-brand-gray text-brand-gray-dark'}`}>
      {status}
    </span>
  );
}

export default function BookingManagementTable() {
  const { data: bookings, isLoading } = useGetBookings();
  const { data: cars } = useGetCars();
  const updateStatus = useUpdateBookingStatus();
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  // Build a map of carId -> car label
  const carMap: Record<string, string> = {};
  if (cars) {
    cars.forEach((c) => {
      carMap[String(Number(c.id))] = `${c.brand} ${c.model} (${Number(c.year)})`;
    });
  }

  const handleStatusChange = async (id: bigint, status: string) => {
    setUpdatingId(id);
    try {
      await updateStatus.mutateAsync({ id, status });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-brand-gray-mid shadow-card p-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-gray-mid shadow-card p-12 text-center">
        <AlertCircle className="w-10 h-10 text-brand-gray-dark mx-auto mb-3" />
        <p className="font-semibold text-brand-black mb-1">No bookings yet</p>
        <p className="text-brand-gray-dark text-sm">Test drive bookings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => exportBookingsCSV(bookings, carMap)}
          className="flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded font-semibold text-sm hover:bg-brand-black/80 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-gray-mid shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-gray border-b border-brand-gray-mid">
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider hidden lg:table-cell">Car</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider hidden md:table-cell">Date & Time</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-mid">
              {bookings.map((booking) => (
                <tr key={Number(booking.id)} className="hover:bg-brand-gray/40 transition-colors">
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-brand-black text-sm">{booking.customerName}</p>
                    {booking.email && (
                      <p className="text-brand-gray-dark text-xs">{booking.email}</p>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <a href={`tel:${booking.phone}`} className="text-brand-red font-medium hover:underline text-sm">
                      {booking.phone}
                    </a>
                  </td>

                  {/* Car */}
                  <td className="px-4 py-3 text-brand-gray-dark text-sm hidden lg:table-cell">
                    {carMap[String(Number(booking.carId))] || (Number(booking.carId) === 0 ? 'Not specified' : `Car #${Number(booking.carId)}`)}
                  </td>

                  {/* Date & Time */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-brand-black text-sm">{booking.date}</p>
                    <p className="text-brand-gray-dark text-xs">{booking.timeSlot}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Update Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {updatingId === booking.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-gray-dark" />
                      ) : (
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className="appearance-none border border-brand-gray-mid rounded px-3 py-1.5 text-xs font-medium text-brand-black focus:outline-none focus:border-brand-red bg-white pr-7 cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-gray-dark pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
