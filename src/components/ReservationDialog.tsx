import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carName?: string;
  carId?: string;
  pricePerDay?: number;
}

const ReservationDialog = ({ open, onOpenChange, carName, carId, pricePerDay = 0 }: ReservationDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Prevent body scroll when dialog is open on mobile
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupLocation: '',
    dropoffLocation: '',
    childSeat: false,
    videoRecorder: false,
  });

  const handleReset = () => {
    setFormData({ name: '', phone: '', email: '', pickupLocation: '', dropoffLocation: '', childSeat: false, videoRecorder: false });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !startDate || !endDate || !formData.pickupLocation || !formData.dropoffLocation) {
      toast({
        title: t('reservation.error'),
        description: t('reservation.fillAll'),
        variant: 'destructive',
      });
      return;
    }

    if (!carId) {
      toast({
        title: t('reservation.error'),
        description: 'Car ID is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Calculate total price
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * pricePerDay;

      const { error } = await supabase
        .from('reservations')
        .insert([{
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          car_id: carId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          child_seat: formData.childSeat,
          video_recorder: formData.videoRecorder,
          total_price: totalPrice,
          status: 'pending',
        }]);

      if (error) throw error;

      toast({
        title: t('reservation.success'),
        description: t('reservation.successMsg'),
      });

      onOpenChange(false);
      setFormData({ name: '', phone: '', email: '', pickupLocation: '', dropoffLocation: '', childSeat: false, videoRecorder: false });
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: t('reservation.error'),
        description: 'Failed to create reservation',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('nav.reserve')}</DialogTitle>
          <DialogDescription>
            {carName ? `${carName} ${t('reservation.forCar')}` : t('reservation.title')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-x-hidden">
          <div className="space-y-2">
            <Label htmlFor="name">{t('contact.name')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('reservation.namePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="w-4 h-4 inline mr-1" />
              {t('contact.phone')} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+994 50 123 45 67"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="w-4 h-4 inline mr-1" />
              {t('contact.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('reservation.startDate')} *</Label>
              {/* Datepicker for Pick Up Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'dd/MM/yyyy') : t('reservation.select')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background max-w-[calc(100vw-3rem)] sm:max-w-none" align="start" side="bottom" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        // Reset end date if it's before or equal to new start date
                        if (endDate) {
                          const end = new Date(endDate);
                          end.setHours(0, 0, 0, 0);
                          const start = new Date(date);
                          start.setHours(0, 0, 0, 0);
                          if (start >= end) {
                            setEndDate(undefined);
                          }
                        }
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('reservation.endDate')} *</Label>
              {/* Datepicker for Return Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'dd/MM/yyyy') : t('reservation.select')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background max-w-[calc(100vw-3rem)] sm:max-w-none" align="start" side="bottom" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                      }
                    }}
                    disabled={(date) => {
                      if (!startDate) return true;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const start = new Date(startDate);
                      start.setHours(0, 0, 0, 0);
                      // Only allow dates that are STRICTLY greater than start date (not equal)
                      return date < today || date <= start;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('reservation.pickupLocation')} *</Label>
              <Select value={formData.pickupLocation} onValueChange={(value) => setFormData({ ...formData, pickupLocation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reservation.selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">{t('reservation.location.office')}</SelectItem>
                  <SelectItem value="airport">{t('reservation.location.airport')}</SelectItem>
                  <SelectItem value="hotel">{t('reservation.location.hotel')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('reservation.dropoffLocation')} *</Label>
              <Select value={formData.dropoffLocation} onValueChange={(value) => setFormData({ ...formData, dropoffLocation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('reservation.selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">{t('reservation.location.office')}</SelectItem>
                  <SelectItem value="airport">{t('reservation.location.airport')}</SelectItem>
                  <SelectItem value="hotel">{t('reservation.location.hotel')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('reservation.additionalOptions')}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="childSeat"
                checked={formData.childSeat}
                onCheckedChange={(checked) => setFormData({ ...formData, childSeat: checked as boolean })}
              />
              <label
                htmlFor="childSeat"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('reservation.options.childSeat')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="videoRecorder"
                checked={formData.videoRecorder}
                onCheckedChange={(checked) => setFormData({ ...formData, videoRecorder: checked as boolean })}
              />
              <label
                htmlFor="videoRecorder"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('reservation.options.videoRecorder')}
              </label>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              {t('cars.reset')}
            </Button>
            <Button type="submit" className="w-full sm:flex-1 bg-gradient-primary">
              {t('reservation.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
