import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAddCar, useUpdateCar } from '../../hooks/useQueries';
import type { Car } from '../../backend';

interface CarFormProps {
  mode: 'add' | 'edit';
  car?: Car;
  onClose: () => void;
}

interface FormState {
  title: string;
  brand: string;
  model: string;
  year: string;
  kmDriven: string;
  fuelType: string;
  transmission: string;
  ownership: string;
  price: string;
  emi: string;
  description: string;
  images: string[];
  status: string;
  featured: boolean;
  slug: string;
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const OWNERSHIP_OPTIONS = ['1st Owner', '2nd Owner', '3rd Owner', '4th Owner+'];
const STATUS_OPTIONS = ['Available', 'Sold'];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function CarForm({ mode, car, onClose }: CarFormProps) {
  const addCar = useAddCar();
  const updateCar = useUpdateCar();

  const [form, setForm] = useState<FormState>({
    title: car?.title || '',
    brand: car?.brand || '',
    model: car?.model || '',
    year: car ? String(Number(car.year)) : String(new Date().getFullYear()),
    kmDriven: car ? String(Number(car.kmDriven)) : '',
    fuelType: car?.fuelType || 'Petrol',
    transmission: car?.transmission || 'Manual',
    ownership: car?.ownership || '1st Owner',
    price: car ? String(Number(car.price)) : '',
    emi: car ? String(Number(car.emi)) : '',
    description: car?.description || '',
    images: car?.images.length ? [...car.images] : [''],
    status: car?.status || 'Available',
    featured: car?.featured || false,
    slug: car?.slug || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Auto-generate slug from brand + model + year
  useEffect(() => {
    if (!car && form.brand && form.model && form.year) {
      setForm((f) => ({
        ...f,
        slug: toSlug(`${f.brand}-${f.model}-${f.year}`),
        title: f.title || `${f.brand} ${f.model} ${f.year}`,
      }));
    }
  }, [form.brand, form.model, form.year, car]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';
    if (!form.year || isNaN(Number(form.year))) newErrors.year = 'Valid year is required';
    if (!form.kmDriven || isNaN(Number(form.kmDriven))) newErrors.kmDriven = 'Valid KM is required';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = 'Valid price is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const carData: Car = {
      id: car?.id || BigInt(0),
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: BigInt(Number(form.year)),
      kmDriven: BigInt(Number(form.kmDriven)),
      fuelType: form.fuelType,
      transmission: form.transmission,
      ownership: form.ownership,
      price: BigInt(Number(form.price)),
      emi: BigInt(Number(form.emi) || 0),
      description: form.description.trim(),
      images: form.images.filter((img) => img.trim() !== ''),
      status: form.status,
      featured: form.featured,
      slug: form.slug.trim(),
    };

    try {
      if (mode === 'add') {
        await addCar.mutateAsync(carData);
      } else if (car) {
        await updateCar.mutateAsync({ id: car.id, carInput: carData });
      }
      onClose();
    } catch (err) {
      console.error('Failed to save car:', err);
    }
  };

  const addImageField = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImageField = (idx: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const updateImage = (idx: number, val: string) =>
    setForm((f) => ({ ...f, images: f.images.map((img, i) => (i === idx ? val : img)) }));

  const isPending = addCar.isPending || updateCar.isPending;

  const inputClass = (field: keyof FormState) =>
    `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors ${
      errors[field] ? 'border-brand-red' : 'border-brand-gray-mid'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-gray-mid">
          <h2 className="font-display font-bold text-xl text-brand-black">
            {mode === 'add' ? 'Add New Car' : 'Edit Car'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-gray transition-colors"
          >
            <X className="w-4 h-4 text-brand-gray-dark" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Title <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Maruti Swift VXI 2020"
                className={inputClass('title')}
              />
              {errors.title && <p className="text-brand-red text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Brand <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                placeholder="e.g. Maruti Suzuki"
                className={inputClass('brand')}
              />
              {errors.brand && <p className="text-brand-red text-xs mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Model <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                placeholder="e.g. Swift"
                className={inputClass('model')}
              />
              {errors.model && <p className="text-brand-red text-xs mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Year <span className="text-brand-red">*</span>
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                min="2000"
                max={new Date().getFullYear()}
                className={inputClass('year')}
              />
              {errors.year && <p className="text-brand-red text-xs mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                KM Driven <span className="text-brand-red">*</span>
              </label>
              <input
                type="number"
                value={form.kmDriven}
                onChange={(e) => setForm((f) => ({ ...f, kmDriven: e.target.value }))}
                placeholder="e.g. 45000"
                min="0"
                className={inputClass('kmDriven')}
              />
              {errors.kmDriven && <p className="text-brand-red text-xs mt-1">{errors.kmDriven}</p>}
            </div>
          </div>

          {/* Fuel / Transmission / Ownership */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value }))}
                className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
              >
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
              >
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">Ownership</label>
              <select
                value={form.ownership}
                onChange={(e) => setForm((f) => ({ ...f, ownership: e.target.value }))}
                className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
              >
                {OWNERSHIP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Price / EMI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Price (₹) <span className="text-brand-red">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 550000"
                min="0"
                className={inputClass('price')}
              />
              {errors.price && <p className="text-brand-red text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                EMI Starting (₹/mo)
              </label>
              <input
                type="number"
                value={form.emi}
                onChange={(e) => setForm((f) => ({ ...f, emi: e.target.value }))}
                placeholder="e.g. 9500"
                min="0"
                className={inputClass('emi')}
              />
            </div>
          </div>

          {/* Status / Featured / Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-brand-red"
                />
                <span className="text-sm font-medium text-brand-black">Featured Car</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Slug <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))}
                placeholder="e.g. maruti-swift-2020"
                className={inputClass('slug')}
              />
              {errors.slug && <p className="text-brand-red text-xs mt-1">{errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the car condition, features, history..."
              rows={3}
              className="w-full border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-brand-gray-dark uppercase tracking-wider">
                Image URLs
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center gap-1 text-brand-red text-xs font-medium hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Image
              </button>
            </div>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    placeholder={`Image URL ${idx + 1}`}
                    className="flex-1 border border-brand-gray-mid rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="w-9 h-9 flex items-center justify-center text-brand-gray-dark hover:text-brand-red transition-colors border border-brand-gray-mid rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {(addCar.isError || updateCar.isError) && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-brand-red">
              Failed to save car. Please try again.
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-brand-gray-mid">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-brand-gray-mid rounded text-sm font-medium text-brand-black hover:bg-brand-gray transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2.5 bg-brand-red text-white rounded text-sm font-bold hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              mode === 'add' ? 'Add Car' : 'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
