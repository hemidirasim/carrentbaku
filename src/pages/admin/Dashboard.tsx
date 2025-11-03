import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus,
  Settings,
  LogOut,
  FileText,
  Briefcase,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalReservations: 0,
    activeReservations: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Load dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const [carsRes, reservationsRes] = await Promise.all([
        fetch(`${API_URL}/cars`),
        fetch(`${API_URL}/reservations`),
      ]);

      const cars = await carsRes.json();
      const reservations = await reservationsRes.json();

      const activeReservations = reservations.filter((r: any) => 
        r.status === 'confirmed' || r.status === 'pending'
      );

      const revenue = reservations
        .filter((r: any) => r.status === 'completed')
        .reduce((sum: number, r: any) => sum + (r.total_price || 0), 0);

      setStats({
        totalCars: cars.length || 0,
        totalReservations: reservations.length || 0,
        activeReservations: activeReservations.length || 0,
        revenue: revenue || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to defaults
      setStats({
        totalCars: 0,
        totalReservations: 0,
        activeReservations: 0,
        revenue: 0,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">
                Available vehicles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}</div>
              <p className="text-xs text-muted-foreground">
                Total bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReservations}</div>
              <p className="text-xs text-muted-foreground">
                Current rentals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Car Management
              </CardTitle>
              <CardDescription>
                Manage your vehicle fleet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button asChild className="flex-1">
                  <Link to="/admin/cars">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Car
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/admin/cars">View All</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Reservations
              </CardTitle>
              <CardDescription>
                Manage bookings and rentals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/reservations">View Reservations</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Blog & Xəbərlər
              </CardTitle>
              <CardDescription>
                Blog yazılarını idarə edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/blog">
                  <FileText className="w-4 h-4 mr-2" />
                  Blog İdarəetməsi
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Xidmətlər
              </CardTitle>
              <CardDescription>
                Xidmətləri idarə edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/services">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Xidmətlər İdarəetməsi
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Kateqoriyalar
              </CardTitle>
              <CardDescription>
                Avtomobil kateqoriyalarını idarə edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/categories">
                  <Tag className="w-4 h-4 mr-2" />
                  Kateqoriyalar İdarəetməsi
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
