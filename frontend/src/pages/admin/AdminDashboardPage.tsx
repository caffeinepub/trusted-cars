import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Car, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CarManagementTable from '@/components/admin/CarManagementTable';
import BookingManagementTable from '@/components/admin/BookingManagementTable';
import CarForm from '@/components/admin/CarForm';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [showCarForm, setShowCarForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate({ to: '/admin' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground text-xs">Trusted Cars Management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="cars">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="cars" className="gap-2">
                <Car className="h-4 w-4" />
                Car Management
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars" className="mt-0">
              <Button onClick={() => setShowCarForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Car
              </Button>
            </TabsContent>
          </div>

          <TabsContent value="cars">
            <CarManagementTable />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagementTable />
          </TabsContent>
        </Tabs>
      </main>

      {/* Car Form Modal */}
      <CarForm
        open={showCarForm}
        onClose={() => setShowCarForm(false)}
        editCar={null}
      />
    </div>
  );
}
