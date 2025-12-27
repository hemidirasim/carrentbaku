import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, MessageCircle, Send, Linkedin, Globe, Music, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactInfo, defaultContactInfo, resolveLocalizedValue } from '@/hooks/useContactInfo';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: contactInfo } = useContactInfo();
  const localizePath = useLocalizedPath();

  const contact = contactInfo ?? defaultContactInfo;

  const companyName = resolveLocalizedValue(contact.company_name, language) || resolveLocalizedValue(defaultContactInfo.company_name, language);
  const phoneNumbers = (contact.phones && contact.phones.length ? contact.phones : defaultContactInfo.phones).filter(Boolean);
  const emailAddresses = (contact.emails && contact.emails.length ? contact.emails : defaultContactInfo.emails).filter(Boolean);
  const officesSource = contact.offices && contact.offices.length ? contact.offices : defaultContactInfo.offices;
  const primaryOffice = officesSource[0];
  const secondaryOffice = officesSource[1];
  const addressPrimary = primaryOffice ? resolveLocalizedValue(primaryOffice.address, language) : resolveLocalizedValue(defaultContactInfo.offices[0].address, language);
  const addressSecondary = secondaryOffice ? resolveLocalizedValue(secondaryOffice.address, language) : "";
  const addressLines = [addressPrimary, addressSecondary].filter((value): value is string => Boolean(value));
  const officeHours = (contact.office_hours && contact.office_hours.length ? contact.office_hours : defaultContactInfo.office_hours).filter(
    item => item && item.label && item.value,
  );
  const socialEntries = Object.entries(contact.social_links ?? defaultContactInfo.social_links).filter(([, url]) =>
    typeof url === 'string' && url.trim().length > 0,
  );

  const buildTelHref = (value?: string) => {
    if (!value) return undefined;
    const digits = value.replace(/[^+\d]/g, '');
    if (!digits) return undefined;
    return digits.startsWith('+') ? `tel:${digits}` : `tel:+${digits}`;
  };

  const buildMailHref = (value?: string) => (value ? `mailto:${value}` : undefined);

  const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    instagram: Instagram,
    whatsapp: MessageCircle,
    telegram: Send,
    youtube: Youtube,
    tiktok: Music,
    linkedin: Linkedin,
  };

  const socialLinks = socialEntries.length > 0 ? socialEntries : Object.entries(defaultContactInfo.social_links);

  return (
    <footer className="bg-gradient-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {companyName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(([key, url]) => {
                const Icon = socialIconMap[key] ?? Globe;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to={localizePath('/')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to={localizePath('/cars')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.cars')}
                </Link>
              </li>
              <li>
                <Link to={localizePath('/services')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to={localizePath('/about')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to={localizePath('/contact')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to={localizePath('/terms')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="space-y-1">
                  {phoneNumbers.map(phone => {
                    const href = buildTelHref(phone);
                    return href ? (
                      <a
                        key={phone}
                        href={href}
                        className="block text-muted-foreground hover:text-primary transition-colors"
                      >
                        {phone}
                      </a>
                    ) : (
                      <span key={phone} className="block text-muted-foreground">
                        {phone}
                      </span>
                    );
                  })}
                </div>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="space-y-1">
                  {emailAddresses.map(email => {
                    const href = buildMailHref(email);
                    return href ? (
                      <a key={email} href={href} className="text-muted-foreground hover:text-primary transition-colors">
                        {email}
                      </a>
                    ) : (
                      <span key={email} className="text-muted-foreground">{email}</span>
                    );
                  })}
                </div>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="text-muted-foreground space-y-1">
                  {addressLines.map(line => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </li>
              {officeHours.length > 0 && (
                <li className="flex items-start space-x-2 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div className="text-muted-foreground space-y-1">
                    <div className="font-semibold mb-1">{t('contact.hoursTitle')}</div>
                    {officeHours.map(({ value }, index) => (
                      <div key={`hours-${index}`}>{value}</div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-sm text-muted-foreground flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CarrentBaku. All rights reserved.</p>
          <p className="sm:text-right">
            <span className="uppercase tracking-wide text-xs text-muted-foreground/70">Created by</span>{' '}
            <a
              href="https://midiya.az"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              midiya.az
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
