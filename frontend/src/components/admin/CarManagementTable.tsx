import { useState } from 'react';
import { Edit2, Trash2, Tag, Loader2, AlertCircle, Image } from 'lucide-react';
import { useGetCars, useDeleteCar, useMarkCarAsSold } from '../../hooks/useQueries';
import CarForm from './CarForm';
import type { Car } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function CarManagementTable() {
  const { data: cars, isLoading } = useGetCars();
  const deleteCar = useDeleteCar();
  const markAsSold = useMarkCarAsSold();
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [soldId, setSoldId] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteCar.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkSold = async (id: bigint) => {
    setSoldId(id);
    try {
      await markAsSold.mutateAsync(id);
    } finally {
      setSoldId(null);
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

  if (!cars || cars.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl border border-brand-gray-mid shadow-card p-12 text-center">
          <AlertCircle className="w-10 h-10 text-brand-gray-dark mx-auto mb-3" />
          <p className="font-semibold text-brand-black mb-1">No cars yet</p>
          <p className="text-brand-gray-dark text-sm">
            Add your first car using the "Add New Car" button above.
          </p>
        </div>

        {/* Edit Modal (kept outside so it can open even when list is empty after a reset) */}
        <CarForm
          open={!!editingCar}
          editCar={editingCar}
          onClose={() => setEditingCar(null)}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-brand-gray-mid shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-gray border-b border-brand-gray-mid">
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">
                  Car
                </th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider hidden sm:table-cell">
                  Year
                </th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider hidden md:table-cell">
                  Fuel
                </th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-semibold text-brand-black text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-mid">
              {cars.map((car) => (
                <tr key={Number(car.id)} className="hover:bg-brand-gray/40 transition-colors">
                  {/* Car Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-brand-gray shrink-0">
                        {car.images[0] ? (
                          <img
                            src={car.images[0]}
                            alt={car.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-4 h-4 text-brand-gray-dark" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-black text-sm leading-tight">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-brand-gray-dark text-xs">{car.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Year */}
                  <td className="px-4 py-3 text-brand-black hidden sm:table-cell">
                    {Number(car.year)}
                  </td>

                  {/* Fuel */}
                  <td className="px-4 py-3 text-brand-gray-dark hidden md:table-cell">
                    {car.fuelType}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-semibold text-brand-black">
                    {formatPrice(car.price)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        car.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-brand-red'
                      }`}
                    >
                      {car.status}
                    </span>
                    {car.featured && (
                      <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => setEditingCar(car)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-brand-gray text-brand-gray-dark hover:text-brand-black transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Mark as Sold */}
                      {car.status === 'Available' && (
                        <button
                          onClick={() => handleMarkSold(car.id)}
                          disabled={soldId === car.id}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-brand-gray text-brand-gray-dark hover:text-brand-red transition-colors disabled:opacity-50"
                          title="Mark as Sold"
                        >
                          {soldId === car.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Tag className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 text-brand-gray-dark hover:text-brand-red transition-colors"
                            title="Delete"
                          >
                            {deletingId === car.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Car</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{' '}
                              <strong>
                                {car.brand} {car.model}
                              </strong>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(car.id)}
                              className="bg-brand-red hover:bg-brand-red-dark text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <CarForm
        open={!!editingCar}
        editCar={editingCar}
        onClose={() => setEditingCar(null)}
      />
    </>
  );
}
