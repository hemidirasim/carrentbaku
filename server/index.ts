import express from 'express';
import cors from 'cors';
import { prisma } from '../src/lib/prisma';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Cars endpoints
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
    });
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const car = await prisma.car.create({
      data: req.body,
    });
    res.json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    await prisma.car.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Reservations endpoints
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { car: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.get('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { car: true },
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = await prisma.reservation.create({
      data: req.body,
      include: { car: true },
    });
    res.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.put('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: req.body,
      include: { car: true },
    });
    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

