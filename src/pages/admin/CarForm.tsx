import { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { resolveLocalizedValue } from '@/hooks/useContactInfo';
import { api, CategoryDto } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface CarData {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  categories?: string[];
  price_per_day: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  fuel_type: string;
  transmission: string;
  seats: number;
  unavailable_dates?: string[] | null;
  image_url: string[] | string;
  features: string[] | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAdmin();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    categories: [] as string[],
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
    unavailable_dates: [] as string[],
    fuel_type: 'petrol',
    transmission: 'automatic',
    seats: 5,
    image_url: [] as string[],
    features: [] as string[],
    available: true,
  });

  const handleCategoryToggle = (value: string) => {
    if (!allowedCategorySlugs.includes(value)) {
      return;
    }
    setFormData(prev => {
      const exists = prev.categories.includes(value);
      if (exists) {
        const next = prev.categories.filter(category => category !== value);
        return { ...prev, categories: next };
      }
      return { ...prev, categories: [...prev.categories, value] };
    });
  };

  const isCategorySelected = (value: string) => formData.categories.includes(value);

  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      loadCar(id);
    }
  }, [id, isEditing]);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll({ includeInactive: false, includeCounts: true });
        if (isMounted) {
          setAvailableCategories(Array.isArray(data) ? (data as CategoryDto[]) : []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) {
          setAvailableCategories([]);
        }
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategories = useMemo(() => {
    return availableCategories
      .filter(category => category?.is_active)
      .sort((a, b) => {
        if ((a?.sort_order ?? 0) !== (b?.sort_order ?? 0)) {
          return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
        }
        const labelA = resolveLocalizedValue(a.name, 'az');
        const labelB = resolveLocalizedValue(b.name, 'az');
        return labelA.localeCompare(labelB);
      });
  }, [availableCategories]);

  const allowedCategorySlugs = useMemo(() => activeCategories.map(category => category.slug), [activeCategories]);

  const getCategoryLabel = (category: CategoryDto) => {
    const label = resolveLocalizedValue(category.name, 'az');
    if (label && label.trim().length > 0) {
      return label;
    }
    return category.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    if (activeCategories.length === 0) {
      return;
    }
    setFormData(prev => {
      const original = Array.isArray(prev.categories) ? prev.categories : [];
      const allowed = new Set(allowedCategorySlugs);
      const filtered = original.filter(slug => allowed.has(slug));
      const unchanged = filtered.length === original.length && filtered.every((slug, index) => slug === original[index]);
      if (unchanged && (filtered.length > 0 || isEditing)) {
        return prev;
      }
      if (filtered.length === 0) {
        if (isEditing) {
          return { ...prev, categories: [] };
        }
        return { ...prev, categories: [activeCategories[0].slug] };
      }
      return { ...prev, categories: filtered };
    });
  }, [activeCategories, allowedCategorySlugs, isEditing]);

  const loadCar = async (carId: string) => {
    try {
      setLoading(true);
      const car = await api.cars.getById(carId);
      
      // Parse image_url from JSON string or array
      let imageUrls: string[] = [];
      if (car.image_url) {
        if (Array.isArray(car.image_url)) {
          imageUrls = car.image_url;
        } else if (typeof car.image_url === 'string') {
          try {
            const parsed = JSON.parse(car.image_url);
            imageUrls = Array.isArray(parsed) ? parsed : [car.image_url];
          } catch {
            imageUrls = [car.image_url];
          }
        }
      }

      const normalizedCategories = Array.isArray((car as any).categories) && (car as any).categories?.length
        ? (car as any).categories.filter((category: unknown): category is string => typeof category === 'string' && category.trim() !== '')
        : (car.category ? [car.category] : []);

      const busyDates = Array.isArray((car as any).unavailable_dates)
        ? (car as any).unavailable_dates
            .map((value: unknown) => {
              if (typeof value !== 'string') {
                return null;
              }
              const trimmed = value.trim();
              if (!trimmed) {
                return null;
              }
              return trimmed;
            })
            .filter((value): value is string => Boolean(value))
        : [];

      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        categories: normalizedCategories,
        price_per_day: car.price_per_day || 0,
        price_per_week: car.price_per_week || car.price_per_day * 7,
        price_per_month: car.price_per_month || car.price_per_day * 30,
        unavailable_dates: busyDates,
        fuel_type: car.fuel_type || 'petrol',
        transmission: car.transmission || 'automatic',
        seats: car.seats || 5,
        image_url: imageUrls,
        features: car.features || [],
        available: car.available !== undefined ? car.available : true,
      });
    } catch (error) {
      console.error('Error loading car:', error);
      toast.error('Avtomobili yükləməkdə xəta baş verdi');
      navigate('/admin/cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.brand.trim()) {
      toast.error('Marka məcburidir');
      return;
    }
    
    if (!formData.model.trim()) {
      toast.error('Model məcburidir');
      return;
    }

    if (!formData.categories || formData.categories.length === 0) {
      toast.error('Ən azı bir kateqoriya seçin');
      return;
    }

    try {
      setLoading(true);
      
      const sanitizedCategories = Array.from(new Set((formData.categories || [])
        .map(category => category.trim())
        .filter(Boolean)
        .filter(category => allowedCategorySlugs.includes(category))));

      if (sanitizedCategories.length === 0) {
        toast.error('Ən azı bir kateqoriya seçin');
        return;
      }

      const submitData = {
        ...formData,
        categories: sanitizedCategories,
        category: sanitizedCategories[0] || 'uncategorized',
        price_per_week: formData.price_per_week || null,
        price_per_month: formData.price_per_month || null,
        unavailable_dates: Array.from(new Set((formData.unavailable_dates || [])
          .map(date => (typeof date === 'string' ? date.trim() : ''))
          .filter((value): value is string => Boolean(value)))).sort(),
      };

      if (isEditing && id) {
        await api.cars.update(id, submitData);
        toast.success('Avtomobil yeniləndi');
      } else {
        await api.cars.create(submitData);
        toast.success('Avtomobil yaradıldı');
      }

      navigate('/admin/cars');
    } catch (error: any) {
      console.error('Error saving car:', error);
      const errorMessage = error?.message || error?.error || 'Avtomobili saxlamaqda xəta baş verdi';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cars')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Avtomobil Redaktə Et' : 'Yeni Avtomobil Yarat'}</h1>
                <p className="text-muted-foreground">{isEditing ? 'Avtomobil məlumatlarını yeniləyin' : 'Yeni avtomobil əlavə edin'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marka *</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    required
                    placeholder="Məs: Toyota"
                  />
                </div>
                <div>
                  <Label>Model *</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    required
                    placeholder="Məs: Camry"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>İl *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <Label>Oturacaq sayı *</Label>
                  <Input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 5 }))}
                    required
                    min="2"
                    max="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Günlük qiymət (AZN) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_per_day === 0 ? '' : formData.price_per_day}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, price_per_day: value }));
                    }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <Label>Həftəlik qiymət (AZN)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_per_week === 0 ? '' : formData.price_per_week}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, price_per_week: value }));
                    }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>Aylıq qiymət (AZN)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_per_month === 0 ? '' : formData.price_per_month}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, price_per_month: value }));
                    }}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>



              <div>
                <Label>Məşğul günlər</Label>
                <Flatpickr
                  value={formData.unavailable_dates}
                  options={{
                    mode: 'multiple',
                    dateFormat: 'Y-m-d',
                    allowInput: true,
                    disableMobile: true,
                    defaultDate: formData.unavailable_dates,
                  }}
                  onChange={(dates, _dateStr, instance) => {
                    const formatted = dates
                      .map(date => {
                        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
                          return null;
                        }
                        return instance.formatDate(date, 'Y-m-d');
                      })
                      .filter((value): value is string => Boolean(value));
                    setFormData(prev => ({
                      ...prev,
                      unavailable_dates: Array.from(new Set(formatted)).sort(),
                    }));
                  }}
                  render={({ defaultValue, value, ...props }, ref) => (
                    <Input
                      {...props}
                      ref={ref as any}
                      value={(formData.unavailable_dates || []).join(', ')}
                      placeholder="YYYY-MM-DD, ..."
                      readOnly
                      className="w-full"
                    />
                  )}
                />
                {formData.unavailable_dates && formData.unavailable_dates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.unavailable_dates.map(date => (
                      <Button
                        key={date}
                        type="button"
                        variant="outline"
                        className="rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            unavailable_dates: (prev.unavailable_dates || []).filter(item => item !== date),
                          }))
                        }
                      >
                        {date}
                        <span className="ml-2 text-xs text-slate-500">×</span>
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Seçilmiş günlərdə avtomobil rezervasiya üçün əlçatan olmayacaq.</span>
                  {formData.unavailable_dates && formData.unavailable_dates.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto px-2 py-0 text-xs text-accent hover:text-accent"
                      onClick={() => setFormData(prev => ({ ...prev, unavailable_dates: [] }))}
                    >
                      Hamısını sil
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Yanacaq növü *</Label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yanacaq növü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Benzin</SelectItem>
                      <SelectItem value="diesel">Dizel</SelectItem>
                      <SelectItem value="hybrid">Hibrid</SelectItem>
                      <SelectItem value="electric">Elektrik</SelectItem>
                      <SelectItem value="gas">Qaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sürət qutusu *</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Avtomatik</SelectItem>
                      <SelectItem value="manual">Mexaniki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Kateqoriyalar *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeCategories.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Əvvəlcə kateqoriya yaradın</span>
                  ) : (
                    activeCategories.map(category => {
                      const selected = isCategorySelected(category.slug);
                      return (
                        <Button
                          key={category.id}
                          type="button"
                          variant={selected ? 'default' : 'outline'}
                          className={selected ? 'bg-gradient-primary' : ''}
                          onClick={() => handleCategoryToggle(category.slug)}
                        >
                          {getCategoryLabel(category)}
                        </Button>
                      );
                    })
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Birdən çox kateqoriya seçə bilərsiniz.</p>
              </div>

              <div>
                <ImageGalleryUpload
                  value={formData.image_url}
                  onChange={(urls) => setFormData(prev => ({ ...prev, image_url: urls }))}
                  folder="cars"
                  label="Avtomobil Şəkilləri"
                  maxImages={10}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="available">Kirayə üçün mövcuddur</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/cars')}>
                  Ləğv et
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Yüklənir...' : (isEditing ? 'Yenilə' : 'Yarat')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CarForm;

