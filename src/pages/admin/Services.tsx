import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Service {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  description_az: string;
  description_ru?: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

const AdminServices = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title_az: '',
    title_ru: '',
    title_en: '',
    title_ar: '',
    description_az: '',
    description_ru: '',
    description_en: '',
    description_ar: '',
    image_url: '',
    category: 'daily-weekly',
  });

  const categories = [
    { value: 'daily-weekly', label: 'Günlük və Həftəlik' },
    { value: 'long-term', label: 'Uzun Müddətli' },
    { value: 'luxury', label: 'Lüks' },
    { value: 'airport', label: 'Hava Limanı' },
    { value: 'driver', label: 'Şofer' },
    { value: 'rental', label: 'Korporativ' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.services.getAll();
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Xidmətləri yükləməkdə xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.services.update(editingService.id, formData);
        toast.success('Xidmət yeniləndi');
      } else {
        await api.services.create(formData);
        toast.success('Xidmət yaradıldı');
      }

      setIsAddDialogOpen(false);
      setEditingService(null);
      setFormData({
        title_az: '',
        title_ru: '',
        title_en: '',
        title_ar: '',
        description_az: '',
        description_ru: '',
        description_en: '',
        description_ar: '',
        image_url: '',
        category: 'daily-weekly',
      });
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Xidməti saxlamaqda xəta baş verdi');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title_az: service.title_az || '',
      title_ru: service.title_ru || '',
      title_en: service.title_en || '',
      title_ar: service.title_ar || '',
      description_az: service.description_az || '',
      description_ru: service.description_ru || '',
      description_en: service.description_en || '',
      description_ar: service.description_ar || '',
      image_url: service.image_url || '',
      category: service.category || 'daily-weekly',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu xidməti silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.services.delete(id);
      toast.success('Xidmət silindi');
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Xidməti silməkdə xəta baş verdi');
    }
  };

  const filteredServices = services.filter(service =>
    service.title_az.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Xidmətlər İdarəetməsi</h1>
                <p className="text-muted-foreground">Xidmətləri idarə edin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingService(null);
                setFormData({
                  title_az: '',
                  title_ru: '',
                  title_en: '',
                  title_ar: '',
                  description_az: '',
                  description_ru: '',
                  description_en: '',
                  description_ar: '',
                  image_url: '',
                  category: 'daily-weekly',
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Xidmət
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Xidmət Redaktə Et' : 'Yeni Xidmət Yarat'}</DialogTitle>
                  <DialogDescription>
                    Xidmətin məlumatlarını doldurun
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Kateqoriya</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Başlıq (AZ) *</Label>
                      <Input
                        value={formData.title_az}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_az: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Şəkil URL</Label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Başlıq (RU)</Label>
                      <Input
                        value={formData.title_ru}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Başlıq (EN)</Label>
                      <Input
                        value={formData.title_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Başlıq (AR)</Label>
                      <Input
                        value={formData.title_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Təsvir (AZ) *</Label>
                    <Textarea
                      value={formData.description_az}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_az: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Təsvir (RU)</Label>
                      <Textarea
                        value={formData.description_ru}
                        onChange={(e) => setFormData(prev => ({ ...prev, description_ru: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Təsvir (EN)</Label>
                      <Textarea
                        value={formData.description_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Təsvir (AR)</Label>
                      <Textarea
                        value={formData.description_ar}
                        onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Ləğv et
                    </Button>
                    <Button type="submit">
                      {editingService ? 'Yenilə' : 'Yarat'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Xidmətlərdə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlıq</TableHead>
                  <TableHead>Kateqoriya</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title_az}</TableCell>
                    <TableCell>
                      {categories.find(c => c.value === service.category)?.label || service.category}
                    </TableCell>
                    <TableCell>
                      {new Date(service.created_at).toLocaleDateString('az-AZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Hələ xidmət yoxdur</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminServices;

