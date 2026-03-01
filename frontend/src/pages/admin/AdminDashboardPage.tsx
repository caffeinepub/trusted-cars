import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Car, Calendar, Plus, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CarManagementTable from '../../components/admin/CarManagementTable';
import BookingManagementTable from '../../components/admin/BookingManagementTable';
import CarForm from '../../components/admin/CarForm';
import { useGetCars, useGetBookings } from '../../hooks/useQueries';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [showAddCar, setShowAddCar] = useState(false);
  const { data: cars } = useGetCars();
  const { data: bookings } = useGetBookings();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate({ to: '/admin' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate({ to: '/admin' });
  };

  const totalCars = cars?.length || 0;
  const availableCars = cars?.filter((c) => c.status === 'Available').length || 0;
  const soldCars = cars?.filter((c) => c.status === 'Sold').length || 0;
  const pendingBookings = bookings?.filter((b) => b.status === 'Pending').length || 0;

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Admin Header */}
      <header className="bg-brand-black text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-base">Trusted Cars</span>
            <span className="text-white/50 text-xs ml-2">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Cars', value: totalCars, icon: Car, color: 'text-brand-black' },
            { label: 'Available', value: availableCars, icon: BarChart3, color: 'text-green-600' },
            { label: 'Sold', value: soldCars, icon: BarChart3, color: 'text-brand-red' },
            { label: 'Pending Bookings', value: pendingBookings, icon: Calendar, color: 'text-blue-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-card border border-brand-gray-mid">
              <div className="flex items-center justify-between mb-2">
                <p className="text-brand-gray-dark text-xs font-medium">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cars">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white border border-brand-gray-mid">
              <TabsTrigger value="cars" className="data-[state=active]:bg-brand-red data-[state=active]:text-white">
                <Car className="w-4 h-4 mr-1.5" />
                Cars
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-brand-red data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-1.5" />
                Bookings
              </TabsTrigger>
            </TabsList>

            <button
              onClick={() => setShowAddCar(true)}
              className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Car
            </button>
          </div>

          <TabsContent value="cars">
            <CarManagementTable />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagementTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Car Modal */}
      {showAddCar && (
        <CarForm
          mode="add"
          onClose={() => setShowAddCar(false)}
        />
      )}
    </div>
  );
}
