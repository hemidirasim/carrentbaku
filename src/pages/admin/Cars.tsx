import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  image_url: string[];
  features: string[] | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

const AdminCars = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await api.cars.getAll();
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
      toast.error('Avtomobilləri yükləməkdə xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: CarData) => {
    navigate(`/admin/cars/${car.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu avtomobili silmək istədiyinizə əminsiniz?')) return;
    
    try {
      await api.cars.delete(id);
      toast.success('Avtomobil silindi');
      await loadCars();
    } catch (error: any) {
      console.error('Error deleting car:', error);
      const errorMessage = error?.message || error?.error || 'Avtomobili silməkdə xəta baş verdi';
      toast.error(errorMessage);
    }
  };

  const filteredCars = cars.filter(car =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Car Management</h1>
                <p className="text-muted-foreground">Manage your vehicle fleet</p>
              </div>
            </div>
            <Button onClick={() => navigate('/admin/cars/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Avtomobil
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
              placeholder="Search cars by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cars Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cars ({filteredCars.length})</CardTitle>
            <CardDescription>
              Manage your vehicle fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading cars...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Fuel</TableHead>
                    <TableHead>Transmission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{car.brand} {car.model}</div>
                          <div className="text-sm text-muted-foreground">
                            {car.seats} seats
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>${car.price_per_day}</TableCell>
                      <TableCell className="capitalize">{car.fuel_type}</TableCell>
                      <TableCell className="capitalize">{car.transmission}</TableCell>
                      <TableCell>
                        <Badge variant={car.available ? 'default' : 'secondary'}>
                          {car.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(car)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCars;
