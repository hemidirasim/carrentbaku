import { useState } from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useContactInfo, defaultContactInfo, resolveLocalizedValue } from "@/hooks/useContactInfo";

const FeedbackForm = () => {
  const { t, language } = useLanguage();
  const { data: contactInfo } = useContactInfo();
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const contact = contactInfo ?? defaultContactInfo;
  const officesSource = contact.offices && contact.offices.length ? contact.offices : defaultContactInfo.offices;
  const primaryOffice = officesSource[0];
  const secondaryOffice = officesSource[1];
  const primaryAddress = primaryOffice ? resolveLocalizedValue(primaryOffice.address, language) : resolveLocalizedValue(defaultContactInfo.offices[0].address, language);
  const secondaryAddress = secondaryOffice ? resolveLocalizedValue(secondaryOffice.address, language) : "";
  const primaryOfficeLabel = primaryOffice ? resolveLocalizedValue(primaryOffice.label, language) : "";
  const secondaryOfficeLabel = secondaryOffice ? resolveLocalizedValue(secondaryOffice.label, language) : "";
  const primaryEmail = (contact.emails && contact.emails.length ? contact.emails[0] : defaultContactInfo.emails[0]) ?? "info@carrentbaku.az";
  const primaryPhone = (contact.phones && contact.phones.length ? contact.phones[0] : defaultContactInfo.phones[0]) ?? "+994 (50) 123 45 67";
  const officeHours = (contact.office_hours && contact.office_hours.length ? contact.office_hours : defaultContactInfo.office_hours).filter(item => item && item.label && item.value);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      toast.error(t("contact.error.fillRequired"));
      return;
    }

    console.log("Contact submitted:", contactData);
    toast.success(t("contact.success"));

    setContactData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="py-20" style={{ backgroundColor: "aliceblue" }}>
      <div className="container mx-auto px-4">
        <div className="rounded-2xl p-0 shadow-elegant overflow-hidden relative max-w-7xl mx-auto">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600" alt="contact background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
                  <span className="text-white">{t("contact.comprehensive.title.part1")}</span> <span className="text-accent">{t("contact.comprehensive.title.part2")}</span>
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-prose">
                  {t("contact.comprehensive.subtitle")}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-white">
                    <MapPin className="w-5 h-5" />
                    <span>{primaryOfficeLabel ? `${primaryOfficeLabel}: ` : ""}{primaryAddress}</span>
                  </div>
                  {secondaryAddress && (
                    <div className="flex items-center space-x-3 text-white/80 ml-8">
                      <span>{secondaryOfficeLabel ? `${secondaryOfficeLabel}: ` : ""}{secondaryAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-white">
                    <Mail className="w-5 h-5" />
                    <span>{primaryEmail}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Phone className="w-5 h-5" />
                    <span>{primaryPhone}</span>
                  </div>
                  {officeHours.length > 0 && (
                    <div className="space-y-2 text-white">
                      {officeHours.map((item, index) => (
                        <div
                          key={`${item.label}-${item.value}`}
                          className={`flex items-center space-x-3 ${index === 0 ? "" : "ml-8 text-white/80"}`}
                        >
                          {index === 0 ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <span className="w-5 h-5" />
                          )}
                          <span>{item.label}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden lg:block h-px bg-white/20" />
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactFirstName" className="text-white font-semibold mb-2 block">
                      {t("contact.firstName")} <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="contactFirstName"
                      name="firstName"
                      value={contactData.firstName}
                      onChange={handleContactChange}
                      className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                      placeholder={t("contact.firstNamePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactLastName" className="text-white font-semibold mb-2 block">
                      {t("contact.lastName")} <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="contactLastName"
                      name="lastName"
                      value={contactData.lastName}
                      onChange={handleContactChange}
                      className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                      placeholder={t("contact.lastNamePlaceholder")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-white font-semibold mb-2 block">
                    {t("contact.email")} <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    name="email"
                    type="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                    placeholder={t("contact.emailPlaceholder")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white font-semibold mb-2 block">
                    {t("contact.subject")}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={contactData.subject}
                    onChange={handleContactChange}
                    className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50"
                    placeholder={t("contact.subjectPlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="contactMessage" className="text-white font-semibold mb-2 block">
                    {t("contact.message")} <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="contactMessage"
                    name="message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    className="bg-white border-none focus-visible:ring-2 focus-visible:ring-white/50 min-h-[120px]"
                    placeholder={t("contact.messagePlaceholder")}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 font-bold text-lg py-4 rounded-lg shadow-lg transition-all hover:shadow-xl"
                >
                  {t("contact.submit")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
