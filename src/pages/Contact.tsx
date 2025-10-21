import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ['+994 (50) 123 45 67', '+994 (51) 234 56 78'],
      href: 'tel:+994501234567',
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['info@carrentbaku.az', 'support@carrentbaku.az'],
      href: 'mailto:info@carrentbaku.az',
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      details: ['Bakı şəhəri', 'Nəsimi rayonu, 28 May küç.'],
      href: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'İş saatları',
      details: ['Bazar ertəsi - Şənbə: 09:00 - 21:00', 'Bazar: 10:00 - 18:00'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-white/90 text-center text-lg">
            Bizə yazın və ya zəng edin. Sizə kömək etməkdən məmnun olarıq!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl">Mesaj Göndərin</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contact.name')}
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Adınızı daxil edin"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contact.email')}
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Telefon
                      </label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+994 (50) 123 45 67"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('contact.message')}
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Mesajınızı buraya yazın..."
                        rows={5}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary">
                      {t('contact.send')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-elegant transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-primary p-3 rounded-lg">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              {info.href && i === 0 ? (
                                <a 
                                  href={info.href}
                                  target={info.href.startsWith('http') ? '_blank' : undefined}
                                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                  className="hover:text-primary transition-colors"
                                >
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* WhatsApp */}
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-elegant transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp ilə yazın</h3>
                      <p className="text-sm text-white/90">Tez cavab alın</p>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-white text-green-600 hover:bg-white/90"
                      onClick={() => window.open('https://wa.me/994501234567', '_blank')}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-center">{t('faq.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>{t('faq.q1')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a1')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>{t('faq.q2')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a2')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>{t('faq.q3')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a3')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>{t('faq.q4')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a4')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>{t('faq.q5')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a5')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>{t('faq.q6')}</AccordionTrigger>
                    <AccordionContent>
                      {t('faq.a6')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="mt-16">
            <Card className="overflow-hidden shadow-elegant">
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Google Maps Xəritəsi</p>
                  <p className="text-sm text-muted-foreground mt-1">Bakı, Azərbaycan</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
