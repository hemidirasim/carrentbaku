import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const languages: Array<{ code: 'az' | 'ru' | 'en' | 'ar'; label: string }> = [
    { code: 'az', label: 'AZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/cars', label: t('nav.cars') },
    { path: '/services', label: t('nav.services') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CARRENTBAKU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-1 bg-secondary rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    language === lang.code
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-background'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Phone */}
            <a
              href="tel:+994501234567"
              className="hidden lg:flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+994 (50) 123 45 67</span>
            </a>

            {/* Reserve Button */}
            <Button className="hidden md:flex bg-gradient-primary shadow-glow hover:shadow-elegant transition-all">
              {t('nav.reserve')}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-background'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 pt-2">
              <Button className="w-full bg-gradient-primary">
                {t('nav.reserve')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
