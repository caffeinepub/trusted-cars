import { useNavigate } from '@tanstack/react-router';
import { Fuel, Settings, Calendar, Gauge, IndianRupee, ArrowRight } from 'lucide-react';
import type { Car } from '../backend';

interface CarCardProps {
  car: Car;
}

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatKm(km: bigint): string {
  return `${Number(km).toLocaleString('en-IN')} km`;
}

export default function CarCard({ car }: CarCardProps) {
  const navigate = useNavigate();
  const isAvailable = car.status === 'Available';
  const firstImage = car.images[0];

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer border border-brand-gray-mid"
      onClick={() => navigate({ to: '/cars/$slug', params: { slug: car.slug } })}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-brand-gray">
        {firstImage ? (
          <img
            src={firstImage}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0Y1RjVGNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iSW50ZXIsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-gray">
            <span className="text-brand-gray-dark text-sm">No Image</span>
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-semibold ${
          isAvailable
            ? 'bg-green-500 text-white'
            : 'bg-brand-red text-white'
        }`}>
          {car.status}
        </div>
        {car.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-semibold bg-brand-black text-white">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-brand-black text-base leading-tight mb-1">
          {car.brand} {car.model}
        </h3>
        <p className="text-xs text-brand-gray-dark mb-3">{car.title}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark">
            <Calendar className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{Number(car.year)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark">
            <Gauge className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{formatKm(car.kmDriven)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark">
            <Fuel className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark">
            <Settings className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-brand-black" />
              <span className="font-display font-bold text-xl text-brand-black">
                {formatPrice(car.price)}
              </span>
            </div>
            {Number(car.emi) > 0 && (
              <p className="text-xs text-brand-gray-dark mt-0.5">
                EMI from ₹{Number(car.emi).toLocaleString('en-IN')}/mo
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: '/cars/$slug', params: { slug: car.slug } });
          }}
          className="w-full flex items-center justify-center gap-2 bg-brand-black text-white py-2.5 rounded text-sm font-semibold hover:bg-brand-red transition-colors duration-200 group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
