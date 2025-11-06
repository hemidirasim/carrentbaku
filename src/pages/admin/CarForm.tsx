import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
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
  price_per_day: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  fuel_type: string;
  transmission: string;
  seats: number;
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
    category: 'ekonomik',
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
    fuel_type: 'petrol',
    transmission: 'automatic',
    seats: 5,
    image_url: [] as string[],
    features: [] as string[],
    available: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadCar(id);
    }
  }, [id, isEditing]);

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

      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        category: car.category || 'ekonomik',
        price_per_day: car.price_per_day || 0,
        price_per_week: car.price_per_week || car.price_per_day * 7,
        price_per_month: car.price_per_month || car.price_per_day * 30,
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

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        price_per_week: formData.price_per_week || null,
        price_per_month: formData.price_per_month || null,
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Yanacaq növü *</Label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Benzin</SelectItem>
                      <SelectItem value="diesel">Dizel</SelectItem>
                      <SelectItem value="electric">Elektrik</SelectItem>
                      <SelectItem value="hybrid">Hibrid</SelectItem>
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
                <Label>Kateqoriya *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kateqoriya seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ekonomik">Ekonomik</SelectItem>
                    <SelectItem value="biznes">Biznes</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="minivan">Minivan</SelectItem>
                  </SelectContent>
                </Select>
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

