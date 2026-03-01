import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAddCar, useUpdateCar } from '@/hooks/useQueries';
import type { Car, CarInput } from '@/backend';
import { toast } from 'sonner';

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  editCar?: Car | null;
}

type FormErrors = Partial<Record<string, string>>;

const defaultForm = {
  title: '',
  brand: '',
  model: '',
  year: '',
  kmDriven: '',
  fuelType: '',
  transmission: '',
  ownership: '',
  price: '',
  emi: '',
  description: '',
  status: 'Available',
  featured: false,
  slug: '',
  images: [''],
};

function generateSlug(brand: string, model: string, year: string): string {
  return [brand, model, year]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function CarForm({ open, onClose, editCar }: CarFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const addCarMutation = useAddCar();
  const updateCarMutation = useUpdateCar();

  const isEdit = !!editCar;
  const isLoading = addCarMutation.isPending || updateCarMutation.isPending;

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editCar) {
        setForm({
          title: editCar.title,
          brand: editCar.brand,
          model: editCar.model,
          year: String(editCar.year),
          kmDriven: String(editCar.kmDriven),
          fuelType: editCar.fuelType,
          transmission: editCar.transmission,
          ownership: editCar.ownership,
          price: String(editCar.price),
          emi: String(editCar.emi),
          description: editCar.description,
          status: editCar.status,
          featured: editCar.featured,
          slug: editCar.slug,
          images: editCar.images.length > 0 ? [...editCar.images] : [''],
        });
        setSlugManuallyEdited(true);
      } else {
        setForm(defaultForm);
        setSlugManuallyEdited(false);
      }
      setErrors({});
      setSubmitError(null);
    }
  }, [open, editCar]);

  // Auto-generate slug from brand + model + year
  useEffect(() => {
    if (!slugManuallyEdited) {
      setForm((prev) => ({
        ...prev,
        slug: generateSlug(prev.brand, prev.model, prev.year),
      }));
    }
  }, [form.brand, form.model, form.year, slugManuallyEdited]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
    setErrors((prev) => ({ ...prev, [`image_${index}`]: undefined }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: images.length > 0 ? images : [''] };
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';
    if (!form.year || isNaN(Number(form.year)) || Number(form.year) < 1900)
      newErrors.year = 'Valid year is required';
    if (!form.kmDriven || isNaN(Number(form.kmDriven)) || Number(form.kmDriven) < 0)
      newErrors.kmDriven = 'Valid KM driven is required';
    if (!form.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!form.transmission) newErrors.transmission = 'Transmission is required';
    if (!form.ownership) newErrors.ownership = 'Ownership is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!form.emi || isNaN(Number(form.emi)) || Number(form.emi) < 0)
      newErrors.emi = 'Valid EMI is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    if (!form.status) newErrors.status = 'Status is required';

    const validImages = form.images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) newErrors.image_0 = 'At least one image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    // Build CarInput — no `id` field, exactly matching the backend CarInput type
    const carInput: CarInput = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: BigInt(Math.floor(Number(form.year))),
      kmDriven: BigInt(Math.floor(Number(form.kmDriven))),
      fuelType: form.fuelType,
      transmission: form.transmission,
      ownership: form.ownership,
      price: BigInt(Math.floor(Number(form.price))),
      emi: BigInt(Math.floor(Number(form.emi))),
      description: form.description.trim(),
      images: form.images.filter((img) => img.trim() !== ''),
      status: form.status,
      featured: form.featured,
      slug: form.slug.trim(),
    };

    console.log('[CarForm] Submitting carInput:', carInput);

    try {
      if (isEdit && editCar) {
        await updateCarMutation.mutateAsync({ id: editCar.id, carInput });
        toast.success('Car updated successfully!');
      } else {
        await addCarMutation.mutateAsync(carInput);
        toast.success('Car added successfully!');
      }
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      console.error('[CarForm] Submit error:', error);
      setSubmitError(message);
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} car: ${message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Car' : 'Add New Car'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Submit error banner */}
          {submitError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              <strong>Error:</strong> {submitError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. 2020 Honda City ZX"
            />
            {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
          </div>

          {/* Brand + Model */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g. Honda"
              />
              {errors.brand && <p className="text-destructive text-xs">{errors.brand}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={form.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="e.g. City"
              />
              {errors.model && <p className="text-destructive text-xs">{errors.model}</p>}
            </div>
          </div>

          {/* Year + KM Driven */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={form.year}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder="e.g. 2020"
                min={1900}
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="text-destructive text-xs">{errors.year}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="kmDriven">KM Driven *</Label>
              <Input
                id="kmDriven"
                type="number"
                value={form.kmDriven}
                onChange={(e) => handleChange('kmDriven', e.target.value)}
                placeholder="e.g. 45000"
                min={0}
              />
              {errors.kmDriven && <p className="text-destructive text-xs">{errors.kmDriven}</p>}
            </div>
          </div>

          {/* Fuel Type + Transmission */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Fuel Type *</Label>
              <Select value={form.fuelType} onValueChange={(v) => handleChange('fuelType', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-destructive text-xs">{errors.fuelType}</p>}
            </div>
            <div className="space-y-1">
              <Label>Transmission *</Label>
              <Select
                value={form.transmission}
                onValueChange={(v) => handleChange('transmission', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmission && (
                <p className="text-destructive text-xs">{errors.transmission}</p>
              )}
            </div>
          </div>

          {/* Ownership + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Ownership *</Label>
              <Select value={form.ownership} onValueChange={(v) => handleChange('ownership', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Owner">1st Owner</SelectItem>
                  <SelectItem value="2nd Owner">2nd Owner</SelectItem>
                  <SelectItem value="3rd Owner">3rd Owner</SelectItem>
                  <SelectItem value="4th+ Owner">4th+ Owner</SelectItem>
                </SelectContent>
              </Select>
              {errors.ownership && <p className="text-destructive text-xs">{errors.ownership}</p>}
            </div>
            <div className="space-y-1">
              <Label>Status *</Label>
              <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-destructive text-xs">{errors.status}</p>}
            </div>
          </div>

          {/* Price + EMI */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="e.g. 650000"
                min={0}
              />
              {errors.price && <p className="text-destructive text-xs">{errors.price}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emi">EMI / month (₹) *</Label>
              <Input
                id="emi"
                type="number"
                value={form.emi}
                onChange={(e) => handleChange('emi', e.target.value)}
                placeholder="e.g. 12000"
                min={0}
              />
              {errors.emi && <p className="text-destructive text-xs">{errors.emi}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the car condition, features, history..."
              rows={4}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <Label htmlFor="slug">
              Slug *{' '}
              <span className="text-muted-foreground text-xs font-normal">
                (auto-generated, editable)
              </span>
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. honda-city-2020"
            />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug}</p>}
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <Label>Image URLs * (at least one required)</Label>
            {form.images.map((img, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                  className="flex-1"
                />
                {form.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImageField(index)}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.image_0 && <p className="text-destructive text-xs">{errors.image_0}</p>}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageField}
              className="mt-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Image URL
            </Button>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => handleChange('featured', checked)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Car
            </Label>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Update Car' : 'Add Car'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
