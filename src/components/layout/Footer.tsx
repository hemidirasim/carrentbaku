import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                CARRENTBAKU
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.cars')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <a href="tel:+994501234567" className="text-muted-foreground hover:text-primary transition-colors">
                    +994 (50) 123 45 67
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:info@carrentbaku.az" className="text-muted-foreground hover:text-primary transition-colors">
                  info@carrentbaku.az
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  Bakı, Azərbaycan
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.rights')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Created by <a href="https://midiya.az" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">midiya.az</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
