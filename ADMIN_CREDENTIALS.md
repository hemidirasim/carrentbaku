# Admin Panel Giriş Məlumatları

## Demo Admin Hesabı

**Email:** `admin@carrentbaku.az`  
**Şifrə:** `admin123`

## İstifadə

1. Admin panelə giriş: `/admin/login`
2. Yuxarıdakı məlumatlarla giriş edin
3. Dashboard-a yönləndiriləcəksiniz

## Əsas Xüsusiyyətlər

- ✅ JWT token ilə təhlükəsiz autentifikasiya
- ✅ Session idarəetməsi (localStorage)
- ✅ Auto-verification (token yoxlanması)
- ✅ Logout funksiyası
- ✅ Dashboard statistikaları (real data)

## API Endpoints

- `POST /api/auth/login` - Giriş
- `POST /api/auth/verify` - Token yoxlanması

## Qeyd

Production-da JWT_SECRET environment variable-ını dəyişdirin!

