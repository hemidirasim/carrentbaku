import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReservationData {
  id: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  car_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  child_seat: boolean;
  video_recorder: boolean;
  total_price: number;
  status: string;
  created_at: string;
  car?: {
    brand: string;
    model: string;
  };
}

const AdminReservations = () => {
  const { user } = useAdmin();
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await api.reservations.getAll();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.reservations.update(id, { status: newStatus });
      await loadReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    
    try {
      await api.reservations.delete(id);
      await loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredReservations = reservations.filter(reservation => {
    const carBrand = reservation.car?.brand || '';
    const matchesSearch = 
      reservation.customer_name.toLowerCase().includes(normalizedSearch) ||
      (reservation.customer_email?.toLowerCase().includes(normalizedSearch) ?? false) ||
      carBrand.toLowerCase().includes(normalizedSearch);
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openDetails = (reservation: ReservationData) => {
    setSelectedReservation(reservation);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedReservation(null);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

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
                <h1 className="text-2xl font-bold">Reservation Management</h1>
                <p className="text-muted-foreground">Manage bookings and rentals</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or car..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Reservations ({filteredReservations.length})</CardTitle>
            <CardDescription>
              Manage customer bookings and rentals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading reservations...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reservation.customer_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.customer_email || '—'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.customer_phone || '—'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {reservation.car ? `${reservation.car.brand} ${reservation.car.model}` : '—'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {new Date(reservation.pickup_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            to {new Date(reservation.return_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${reservation.total_price}</TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetails(reservation)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reservation.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {reservation.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(reservation.id, 'active')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {reservation.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
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

      <Dialog open={detailsOpen} onOpenChange={(open) => (open ? setDetailsOpen(true) : closeDetails())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              Full breakdown of the booking information
            </DialogDescription>
          </DialogHeader>

          {selectedReservation ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Customer</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-lg font-medium">{selectedReservation.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.customer_email || '—'}</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.customer_phone || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Car</h3>
                  <p className="text-base font-medium">
                    {selectedReservation.car
                      ? `${selectedReservation.car.brand} ${selectedReservation.car.model}`
                      : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">{selectedReservation.car_id}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Status</h3>
                  {getStatusBadge(selectedReservation.status)}
                  <p className="text-sm text-muted-foreground mt-2">
                    Created {formatDate(selectedReservation.created_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Pickup</h3>
                  <p className="text-base font-medium">{formatDate(selectedReservation.pickup_date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReservation.pickup_location || '—'}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Return</h3>
                  <p className="text-base font-medium">{formatDate(selectedReservation.return_date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReservation.dropoff_location || '—'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Extras</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      Child Seat:{' '}
                      <span className="font-medium">
                        {selectedReservation.child_seat ? 'Yes' : 'No'}
                      </span>
                    </li>
                    <li>
                      Video Recorder:{' '}
                      <span className="font-medium">
                        {selectedReservation.video_recorder ? 'Yes' : 'No'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Total Price</h3>
                  <p className="text-2xl font-semibold">${selectedReservation.total_price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reservation selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservations;
