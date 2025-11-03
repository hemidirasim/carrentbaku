import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CarData {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price_per_day: number;
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
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'ekonomik',
    price_per_day: 0,
    fuel_type: 'petrol',
    transmission: 'automatic',
    seats: 5,
    image_url: [],
    features: [] as string[],
    available: true,
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await api.cars.update(editingCar.id, formData);
      } else {
        await api.cars.create(formData);
      }
      
      await loadCars();
      setIsAddDialogOpen(false);
      setEditingCar(null);
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'ekonomik',
        price_per_day: 0,
        fuel_type: 'petrol',
        transmission: 'automatic',
        seats: 5,
        image_url: [],
        features: [] as string[],
        available: true,
      });
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleEdit = (car: CarData) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      price_per_day: car.price_per_day,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      seats: car.seats,
      image_url: Array.isArray(car.image_url) ? car.image_url : (car.image_url ? [car.image_url] : []),
      features: car.features || [],
      available: car.available,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
      await api.cars.delete(id);
      await loadCars();
    } catch (error) {
      console.error('Error deleting car:', error);
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCar ? 'Update car information' : 'Add a new vehicle to your fleet'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Day</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price_per_day}
                        onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seats">Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuel_type">Fuel Type</Label>
                      <Select
                        value={formData.fuel_type}
                        onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select
                        value={formData.transmission}
                        onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

                  <div className="space-y-2">
                    <ImageGalleryUpload
                      value={formData.image_url}
                      onChange={(urls) => setFormData({ ...formData, image_url: urls })}
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
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="available">Available for rent</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingCar(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCar ? 'Update Car' : 'Add Car'}
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
