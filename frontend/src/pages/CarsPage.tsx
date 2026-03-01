import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useGetCars } from '../hooks/useQueries';
import CarCard from '../components/CarCard';
import { Skeleton } from '@/components/ui/skeleton';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

const BUDGET_RANGES = [
  { label: 'Under ₹3 Lakh', min: 0, max: 300000 },
  { label: '₹3L – ₹5L', min: 300000, max: 500000 },
  { label: '₹5L – ₹8L', min: 500000, max: 800000 },
  { label: '₹8L – ₹12L', min: 800000, max: 1200000 },
  { label: '₹12L – ₹20L', min: 1200000, max: 2000000 },
  { label: 'Above ₹20L', min: 2000000, max: Infinity },
];

interface Filters {
  budget: string;
  brand: string;
  fuelType: string;
  transmission: string;
  year: string;
}

const defaultFilters: Filters = {
  budget: '',
  brand: '',
  fuelType: '',
  transmission: '',
  year: '',
};

export default function CarsPage() {
  const { data: cars, isLoading } = useGetCars();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const brands = useMemo(() => {
    if (!cars) return [];
    return [...new Set(cars.map((c) => c.brand))].sort();
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!cars) return [];
    return cars.filter((car) => {
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.year && Number(car.year) !== parseInt(filters.year)) return false;
      if (filters.budget) {
        const range = BUDGET_RANGES.find((r) => r.label === filters.budget);
        if (range) {
          const price = Number(car.price);
          if (price < range.min || price > range.max) return false;
        }
      }
      return true;
    });
  }, [cars, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => setFilters(defaultFilters);

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-brand-black text-base">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-brand-red text-xs font-medium hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">Budget</label>
        <div className="space-y-1.5">
          {BUDGET_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="budget"
                value={range.label}
                checked={filters.budget === range.label}
                onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value }))}
                className="accent-brand-red"
              />
              <span className={`text-sm transition-colors ${filters.budget === range.label ? 'text-brand-red font-medium' : 'text-brand-black group-hover:text-brand-red'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">Brand</label>
        <div className="relative">
          <select
            value={filters.brand}
            onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
            className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-red appearance-none bg-white"
          >
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark pointer-events-none" />
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((fuel) => (
            <button
              key={fuel}
              onClick={() => setFilters((f) => ({ ...f, fuelType: f.fuelType === fuel ? '' : fuel }))}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                filters.fuelType === fuel
                  ? 'bg-brand-red text-white border-brand-red'
                  : 'bg-white text-brand-black border-brand-gray-mid hover:border-brand-red hover:text-brand-red'
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">Transmission</label>
        <div className="flex gap-2">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t}
              onClick={() => setFilters((f) => ({ ...f, transmission: f.transmission === t ? '' : t }))}
              className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${
                filters.transmission === t
                  ? 'bg-brand-red text-white border-brand-red'
                  : 'bg-white text-brand-black border-brand-gray-mid hover:border-brand-red hover:text-brand-red'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-2">Year</label>
        <div className="relative">
          <select
            value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
            className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-red appearance-none bg-white"
          >
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Page Header */}
      <div className="bg-brand-black py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-1">Browse</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">Used Cars in Karol Bagh</h1>
          <p className="text-white/60 text-sm mt-2">Certified pre-owned cars with transparent pricing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <p className="text-sm text-brand-gray-dark">
            {isLoading ? 'Loading...' : `${filteredCars.length} cars found`}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-brand-gray-mid px-4 py-2 rounded text-sm font-medium text-brand-black hover:border-brand-red transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-brand-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="lg:hidden bg-white rounded-xl p-5 mb-6 shadow-card border border-brand-gray-mid">
            <FilterPanel />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-card border border-brand-gray-mid sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Car Grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-brand-gray-dark">
                {isLoading ? 'Loading...' : `${filteredCars.length} cars found`}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-brand-red text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-brand-gray-mid bg-white">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={Number(car.id)} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-brand-gray-mid">
                <div className="w-16 h-16 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-brand-gray-dark" />
                </div>
                <h3 className="font-display font-bold text-xl text-brand-black mb-2">No Cars Found</h3>
                <p className="text-brand-gray-dark text-sm mb-4">Try adjusting your filters to see more results.</p>
                <button
                  onClick={clearFilters}
                  className="bg-brand-red text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
