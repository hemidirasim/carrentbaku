import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  image_url?: string | string[];
  features?: string | { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] };
  created_at: string;
  updated_at: string;
}

const AdminServices = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleEdit = (service: Service) => {
    navigate(`/admin/services/${service.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu xidməti silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.services.delete(id);
      toast.success('Xidmət silindi');
      await loadServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      const errorMessage = error?.message || error?.error || 'Xidməti silməkdə xəta baş verdi';
      toast.error(errorMessage);
    }
  };

  const filteredServices = services.filter(service =>
    service.title_az.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Button onClick={() => navigate('/admin/services/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Xidmət
            </Button>
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
                  <TableHead>Şəkil</TableHead>
                  <TableHead>Başlıq</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {(() => {
                        let imageUrls: string[] = [];
                        if (service.image_url) {
                          if (Array.isArray(service.image_url)) {
                            imageUrls = service.image_url;
                          } else if (typeof service.image_url === 'string') {
                            try {
                              const parsed = JSON.parse(service.image_url);
                              imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
                            } catch {
                              imageUrls = [service.image_url];
                            }
                          }
                        }
                        return imageUrls.length > 0 ? (
                          <img 
                            src={imageUrls[0]} 
                            alt={service.title_az}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Şəkil yoxdur</span>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="font-medium">{service.title_az}</TableCell>
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
