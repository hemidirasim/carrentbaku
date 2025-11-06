import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/lib/prisma';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is admin
    const isAdmin = user.roles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isAdmin = user.roles.some(role => role.role === 'admin');
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Cars endpoints
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { created_at: 'desc' },
    });
    // Convert image_url from JSON string to array for frontend compatibility
    const carsWithArrayImages = cars.map(car => ({
      ...car,
      image_url: car.image_url ? (() => {
        try {
          const parsed = JSON.parse(car.image_url);
          return Array.isArray(parsed) ? parsed : [car.image_url];
        } catch {
          return [car.image_url];
        }
      })() : [],
    }));
    res.json(carsWithArrayImages);
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
    // Convert image_url from JSON string to array for frontend compatibility
    const carWithArrayImages = {
      ...car,
      image_url: car.image_url ? (() => {
        try {
          const parsed = JSON.parse(car.image_url);
          return Array.isArray(parsed) ? parsed : [car.image_url];
        } catch {
          return [car.image_url];
        }
      })() : [],
    };
    res.json(carWithArrayImages);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    // Handle image_url: if array, extract URLs and store as JSON string
    // This allows us to store multiple images as JSON until we can migrate to array
    let imageUrlValue: string | null = null;
    if (req.body.image_url) {
      if (Array.isArray(req.body.image_url) && req.body.image_url.length > 0) {
        // Extract URLs from array
        const urls = req.body.image_url.map((img: any) => {
          if (typeof img === 'string') {
            try {
              // If it's a JSON string, parse it
              const parsed = JSON.parse(img);
              return parsed.url || img;
            } catch {
              return img;
            }
          } else if (typeof img === 'object' && img.url) {
            return img.url;
          }
          return img;
        });
        // Store as JSON string for now
        imageUrlValue = JSON.stringify(urls);
      } else if (typeof req.body.image_url === 'string') {
        imageUrlValue = req.body.image_url;
      }
    }
    
    const carData = {
      ...req.body,
      image_url: imageUrlValue,
    };
    
    const car = await prisma.car.create({
      data: carData,
    });
    
    // Return with image_url as array for frontend compatibility
    const response = {
      ...car,
      image_url: car.image_url ? (() => {
        try {
          const parsed = JSON.parse(car.image_url);
          return Array.isArray(parsed) ? parsed : [car.image_url];
        } catch {
          return [car.image_url];
        }
      })() : [],
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    // Handle image_url: if array, extract URLs and store as JSON string
    let imageUrlValue: string | null | undefined = undefined;
    if (req.body.image_url !== undefined) {
      if (Array.isArray(req.body.image_url)) {
        if (req.body.image_url.length > 0) {
          const urls = req.body.image_url.map((img: any) => {
            if (typeof img === 'string') {
              try {
                const parsed = JSON.parse(img);
                return parsed.url || img;
              } catch {
                return img;
              }
            } else if (typeof img === 'object' && img.url) {
              return img.url;
            }
            return img;
          });
          imageUrlValue = JSON.stringify(urls);
        } else {
          imageUrlValue = null;
        }
      } else if (typeof req.body.image_url === 'string') {
        imageUrlValue = req.body.image_url;
      } else if (req.body.image_url === null) {
        imageUrlValue = null;
      }
    }
    
    const carData = {
      ...req.body,
      image_url: imageUrlValue,
    };
    
    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: carData,
    });
    
    // Return with image_url as array for frontend compatibility
    const response = {
      ...car,
      image_url: car.image_url ? (() => {
        try {
          const parsed = JSON.parse(car.image_url);
          return Array.isArray(parsed) ? parsed : [car.image_url];
        } catch {
          return [car.image_url];
        }
      })() : [],
    };
    
    res.json(response);
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

// Services endpoints
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { created_at: 'desc' },
    });
    
    // Parse image_url and features from JSON strings
    const parsedServices = services.map(service => {
      let imageUrls: string[] = [];
      if (service.image_url) {
        try {
          const parsed = JSON.parse(service.image_url);
          imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
        } catch {
          imageUrls = [service.image_url];
        }
      }

      let features: { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] } = {};
      if (service.features) {
        try {
          features = JSON.parse(service.features);
        } catch {
          features = {};
        }
      }

      return {
        ...service,
        image_url: imageUrls,
        features: features,
      };
    });
    
    res.json(parsedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Parse image_url and features from JSON strings
    let imageUrls: string[] = [];
    if (service.image_url) {
      try {
        const parsed = JSON.parse(service.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
      } catch {
        imageUrls = [service.image_url];
      }
    }

    let features: { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] } = {};
    if (service.features) {
      try {
        features = JSON.parse(service.features);
      } catch {
        features = {};
      }
    }

    res.json({
      ...service,
      image_url: imageUrls,
      features: features,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Blog endpoints
app.get('/api/blog', async (req, res) => {
  try {
    const published = req.query.published === 'true';
    const where = published ? { published: true } : {};
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { published_at: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    const where = featured ? { featured: true } : {};
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Contact messages endpoints
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({
      data: req.body,
    });
    res.json(message);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

app.put('/api/contact/:id', async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(message);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

// Blog management endpoints (admin only - needs auth middleware in production)
app.post('/api/blog', async (req, res) => {
  try {
    const post = await prisma.blogPost.create({
      data: req.body,
    });
    res.json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/blog/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Service management endpoints
app.post('/api/services', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title_az || !req.body.description_az) {
      return res.status(400).json({ error: 'title_az and description_az are required' });
    }
    
    // image_url and features are already JSON strings from frontend
    const service = await prisma.service.create({
      data: req.body,
    });
    
    // Parse for response
    let imageUrls: string[] = [];
    if (service.image_url) {
      try {
        const parsed = JSON.parse(service.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
      } catch {
        imageUrls = [service.image_url];
      }
    }

    let features: { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] } = {};
    if (service.features) {
      try {
        features = JSON.parse(service.features);
      } catch {
        features = {};
      }
    }

    res.json({
      ...service,
      image_url: imageUrls,
      features: features,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    // image_url and features are already JSON strings from frontend
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body,
    });
    
    // Parse for response
    let imageUrls: string[] = [];
    if (service.image_url) {
      try {
        const parsed = JSON.parse(service.image_url);
        imageUrls = Array.isArray(parsed) ? parsed : [service.image_url];
      } catch {
        imageUrls = [service.image_url];
      }
    }

    let features: { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] } = {};
    if (service.features) {
      try {
        features = JSON.parse(service.features);
      } catch {
        features = {};
      }
    }

    res.json({
      ...service,
      image_url: imageUrls,
      features: features,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Car categories management (get categories from cars)
app.get('/api/categories', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    const categories = cars.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

