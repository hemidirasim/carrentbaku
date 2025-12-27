import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useContactInfo, defaultContactInfo, resolveLocalizedValue } from "@/hooks/useContactInfo";

type ContactCard = {
  icon: LucideIcon;
  title: string;
  details: string[];
  linkBuilder?: (value: string, index: number) => string | undefined;
};

type OfficeDisplay = {
  id: string;
  title: string;
  address: string;
  mapUrl: string | null;
};

const buildTelHref = (value: string) => {
  const digits = value.replace(/[^+\d]/g, "");
  if (!digits) return undefined;
  return digits.startsWith("+") ? `tel:${digits}` : `tel:+${digits}`;
};

const buildMailHref = (value: string) => (value ? `mailto:${value}` : undefined);

const buildMapEmbedSrc = (rawUrl: string): string | null => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const isHttp = /^https?:\/\//i.test(trimmed);
  const looksEmbedded = trimmed.includes("output=embed") || trimmed.includes("/embed");

  if (isHttp && looksEmbedded) {
    return trimmed;
  }

  const queryTarget = isHttp ? trimmed : trimmed.replace(/\s+/g, " ");
  const encoded = encodeURIComponent(queryTarget);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
};

const renderMap = (mapUrl: string | null, fallbackAddress?: string) => {
  if (!mapUrl) {
    return (
      <div className="text-center py-6">
        <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
        {fallbackAddress ? (
          <p className="text-muted-foreground">{fallbackAddress}</p>
        ) : (
          <p className="text-muted-foreground">Xəritə məlumatı əlavə edilməyib</p>
        )}
      </div>
    );
  }

  if (mapUrl.includes("<iframe")) {
    return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: mapUrl }} />;
  }

  const embedSrc = buildMapEmbedSrc(mapUrl);

  if (!embedSrc) {
    return (
      <div className="text-center py-6">
        <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
        {fallbackAddress ? (
          <p className="text-muted-foreground">{fallbackAddress}</p>
        ) : (
          <p className="text-muted-foreground">Xəritə məlumatı əlavə edilməyib</p>
        )}
      </div>
    );
  }

  return (
    <iframe
      src={embedSrc}
      title="Map"
      className="w-full h-full border-0"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

const Contact = () => {
  const { t, language } = useLanguage();
  const { data: contactInfo } = useContactInfo();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const contact = contactInfo ?? defaultContactInfo;

  const officesSource = contact.offices && contact.offices.length ? contact.offices : defaultContactInfo.offices;
  const officeItems: OfficeDisplay[] = officesSource.map((office, index) => {
    const title = resolveLocalizedValue(office.label, language) || `${t("contact.office", { defaultValue: "Ofis" })} ${index + 1}`;
    const address = resolveLocalizedValue(office.address, language);
    const mapUrl = office.map_embed_url ?? contact.map_embed_url ?? defaultContactInfo.map_embed_url;
    return {
      id: office.id || `office-${index}`,
      title,
      address,
      mapUrl,
    };
  });

  const primaryOffice = officeItems[0];

  const phoneNumbers = (contact.phones && contact.phones.length ? contact.phones : defaultContactInfo.phones).filter(Boolean);
  const emailAddresses = (contact.emails && contact.emails.length ? contact.emails : defaultContactInfo.emails).filter(Boolean);

  const officeAddresses = officeItems.map(item => (item.address ? `${item.title}: ${item.address}` : item.title));

  const officeMapLinks = officeItems.map(item => item.mapUrl ?? "");

  const contactCards: ContactCard[] = [
    {
      icon: Phone,
      title: t("contact.phone"),
      details: phoneNumbers,
      linkBuilder: value => buildTelHref(value),
    },
    {
      icon: Mail,
      title: t("contact.email"),
      details: emailAddresses,
      linkBuilder: value => buildMailHref(value),
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      details: officeAddresses,
      linkBuilder: (_value, index) => {
        const mapUrl = officeMapLinks[index];
        return mapUrl && mapUrl.includes("http") ? mapUrl : undefined;
      },
    },
  ];

  const officeHoursRaw = contact.office_hours && contact.office_hours.length ? contact.office_hours : defaultContactInfo.office_hours;
  const officeHours = officeHoursRaw.filter(item => item && item.label && item.value);

  if (officeHours.length) {
    contactCards.push({
      icon: Clock,
      title: t("contact.hoursTitle"),
      details: officeHours.map((item, index) => item.value),
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    const trimmedName = formData.name.trim();
    const nameParts = trimmedName.split(/\s+/).filter(Boolean);
    const firstName = (nameParts[0] ?? trimmedName) || "Qonaq";
    const lastName = nameParts.slice(1).join(" ") || "Müştəri";
    const email = formData.email.trim();
    const messageBody = formData.message.trim();

    if (!email || !messageBody) {
      toast.error(t("contact.error.fillRequired"));
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: formData.phone.trim() || null,
      subject: "Website Contact Form",
      message: messageBody,
    };

    try {
      setSubmitting(true);
      const response = await api.contact.create(payload);
      if (response && typeof response === 'object' && 'error' in response) {
        throw new Error((response as any).error);
      }
      toast.success(t("contact.success"));
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error(t("contact.error.sendFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-white/90 text-center text-lg">
            {t("contact.comprehensive.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl">{t("contact.sendMessage")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("contact.name")}
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("contact.firstNamePlaceholder")}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("contact.email")}
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("contact.phone")}
                      </label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={phoneNumbers[0] ?? "+994 (50) 123 45 67"}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("contact.message")}
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t("contact.messagePlaceholder")}
                        rows={5}
                        disabled={submitting}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary" disabled={submitting}>
                      {submitting ? t("reservation.submitting") : t("contact.send")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {contactCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={`${card.title}-${index}`} className="hover:shadow-elegant transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-primary p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{card.title}</h3>
                          <div className="space-y-1">
                            {card.details.map((detail, detailIndex) => {
                              const link = card.linkBuilder ? card.linkBuilder(detail, detailIndex) : undefined;
                              const external = link ? link.startsWith("http") : false;
                              if (link) {
                                return (
                                  <a
                                    key={`${detail}-${detailIndex}`}
                                    href={link}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                  >
                                    {detail}
                                  </a>
                                );
                              }
                              return (
                                <span key={`${detail}-${detailIndex}`} className="text-sm text-muted-foreground block">
                                  {detail}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {officeItems.map((office, index) => (
                <Card key={office.id} className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center justify-between">
                      <span>{office.title}</span>
                      <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {office.address && (
                      <p className="text-muted-foreground flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-1 text-primary" />
                        <span>{office.address}</span>
                      </p>
                    )}
                    <div className="aspect-video rounded-lg overflow-hidden border border-border">
                      {renderMap(office.mapUrl, office.address)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
