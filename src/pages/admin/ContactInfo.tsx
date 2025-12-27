import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import {
  useContactInfo,
  defaultContactInfo,
  ContactInfo,
  ContactOffice,
  LANGUAGE_CODES,
  LanguageCode,
  LocalizedStrings,
} from "@/hooks/useContactInfo";

interface EditableContactInfo extends ContactInfo {}
interface EditableOffice extends ContactOffice {}

const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

const createEmptyLocalized = (): LocalizedStrings => {
  const map: LocalizedStrings = {};
  for (const code of LANGUAGE_CODES) {
    map[code] = "";
  }
  return map;
};

const createOfficeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `office-${Math.random().toString(36).slice(2, 10)}`;
};

const cloneOffice = (office: ContactOffice): EditableOffice => ({
  id: office.id,
  label: { ...office.label },
  address: { ...office.address },
  map_embed_url: office.map_embed_url ?? null,
});

const createNewOffice = (): EditableOffice => ({
  id: createOfficeId(),
  label: createEmptyLocalized(),
  address: createEmptyLocalized(),
  map_embed_url: null,
});

const cloneContactInfo = (info: ContactInfo): EditableContactInfo => ({
  id: info.id,
  company_name: { ...info.company_name },
  tagline: { ...info.tagline },
  description: { ...info.description },
  address: { ...info.address },
  address_secondary: { ...info.address_secondary },
  map_embed_url: info.map_embed_url,
  phones: [...info.phones],
  emails: [...info.emails],
  whatsapp_numbers: [...info.whatsapp_numbers],
  office_hours: info.office_hours.map(item => ({ ...item })),
  social_links: { ...info.social_links },
  offices: (info.offices && info.offices.length ? info.offices : defaultContactInfo.offices).map(cloneOffice),
});

const cloneDefault = () => cloneContactInfo(defaultContactInfo);

const sanitizeLocalized = (value: LocalizedStrings): LocalizedStrings => {
  const cleaned: LocalizedStrings = {};
  for (const code of LANGUAGE_CODES) {
    const trimmed = (value[code] ?? "").trim();
    if (trimmed) {
      cleaned[code] = trimmed;
    }
  }
  return cleaned;
};

const sanitizeOffices = (offices: EditableOffice[]) => {
  return offices
    .map(office => {
      const address = sanitizeLocalized(office.address);
      const hasAddress = LANGUAGE_CODES.some(code => (address[code] ?? "").trim().length > 0);
      if (!hasAddress) {
        return null;
      }
      const label = sanitizeLocalized(office.label);
      const mapUrl = office.map_embed_url?.trim() || null;
      return {
        id: office.id || createOfficeId(),
        label,
        address,
        map_embed_url: mapUrl,
      };
    })
    .filter((entry): entry is { id: string; label: LocalizedStrings; address: LocalizedStrings; map_embed_url: string | null } => Boolean(entry));
};

const AdminContactInfo = () => {
  const navigate = useNavigate();
  const { user: _user } = useAdmin();
  const { data, isLoading, refetch } = useContactInfo();
  const [formData, setFormData] = useState<EditableContactInfo>(() => cloneDefault());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(cloneContactInfo(data));
    }
  }, [data]);

  const handleArrayChange = (
    field: "phones" | "emails" | "whatsapp_numbers",
    index: number,
    value: string,
  ) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated } as EditableContactInfo;
    });
  };

  const handleAddArrayItem = (field: "phones" | "emails" | "whatsapp_numbers") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (
    field: "phones" | "emails" | "whatsapp_numbers",
    index: number,
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleOfficeHourChange = (index: number, key: "label" | "value", value: string) => {
    setFormData(prev => ({
      ...prev,
      office_hours: prev.office_hours.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const handleAddOfficeHour = () => {
    setFormData(prev => ({
      ...prev,
      office_hours: [...prev.office_hours, { label: "", value: "" }],
    }));
  };

  const handleRemoveOfficeHour = (index: number) => {
    setFormData(prev => ({
      ...prev,
      office_hours: prev.office_hours.filter((_, i) => i !== index),
    }));
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [key]: value,
      },
    }));
  };

  const handleLocalizedChange = (
    field: keyof Pick<
      EditableContactInfo,
      "company_name" | "tagline" | "description" | "address" | "address_secondary"
    >,
    code: LanguageCode,
    value: string,
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [code]: value,
      },
    }) as EditableContactInfo);
  };

  const handleOfficeLocalizedChange = (
    officeId: string,
    field: "label" | "address",
    code: LanguageCode,
    value: string,
  ) => {
    setFormData(prev => ({
      ...prev,
      offices: prev.offices.map(office =>
        office.id === officeId
          ? {
              ...office,
              [field]: {
                ...office[field],
                [code]: value,
              },
            }
          : office,
      ),
    }));
  };

  const handleOfficeMapChange = (officeId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      offices: prev.offices.map(office =>
        office.id === officeId
          ? {
              ...office,
              map_embed_url: value,
            }
          : office,
      ),
    }));
  };

  const handleAddOffice = () => {
    setFormData(prev => ({
      ...prev,
      offices: [...prev.offices, createNewOffice()],
    }));
  };

  const handleRemoveOffice = (officeId: string) => {
    setFormData(prev => {
      const remaining = prev.offices.filter(office => office.id !== officeId);
      return {
        ...prev,
        offices: remaining.length > 0 ? remaining : [createNewOffice()],
      };
    });
  };

  const sanitizedPhones = useMemo(
    () => formData.phones.map(phone => phone.trim()).filter(Boolean),
    [formData.phones],
  );

  const sanitizedEmails = useMemo(
    () => formData.emails.map(email => email.trim()).filter(Boolean),
    [formData.emails],
  );

  const sanitizedWhatsapp = useMemo(
    () => formData.whatsapp_numbers.map(num => num.trim()).filter(Boolean),
    [formData.whatsapp_numbers],
  );

  const sanitizedOfficeHours = useMemo(
    () =>
      formData.office_hours
        .map(item => ({ label: item.label.trim(), value: item.value.trim() }))
        .filter(item => item.label && item.value),
    [formData.office_hours],
  );

  const sanitizedSocialLinks = useMemo(() => {
    const entries = Object.entries(formData.social_links || {}).map(([key, value]) => [
      key,
      (value || "").trim(),
    ]);
    return entries.reduce<Record<string, string>>((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [formData.social_links]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!sanitizedPhones.length) {
      toast.error("Ən azı bir telefon nömrəsi daxil edin");
      return;
    }

    if (!sanitizedEmails.length) {
      toast.error("Ən azı bir e-poçt ünvanı daxil edin");
      return;
    }

    const sanitizedOffices = sanitizeOffices(formData.offices);
    if (!sanitizedOffices.length) {
      toast.error("Ən azı bir ofis ünvanı daxil edin");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company_name: sanitizeLocalized(formData.company_name),
        tagline: sanitizeLocalized(formData.tagline),
        description: sanitizeLocalized(formData.description),
        address: sanitizeLocalized(formData.address),
        address_secondary: sanitizeLocalized(formData.address_secondary),
        map_embed_url: formData.map_embed_url?.trim() || null,
        phones: sanitizedPhones,
        emails: sanitizedEmails,
        whatsapp_numbers: sanitizedWhatsapp,
        office_hours: sanitizedOfficeHours,
        social_links: sanitizedSocialLinks,
        offices: sanitizedOffices,
      };

      await api.contactInfo.update(payload);
      await refetch();
      toast.success("Əlaqə məlumatları yeniləndi");
    } catch (error: any) {
      console.error("Error saving contact info:", error);
      const message = error?.error || error?.message || "Məlumatı saxlamaq mümkün olmadı";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Əlaqə Məlumatları</h1>
                <p className="text-muted-foreground">Saytda göstərilən əlaqə və sosial şəbəkə məlumatlarını redaktə edin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Şirkət məlumatları</CardTitle>
              <CardDescription>Hər dil üçün ayrıca mətn daxil edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Şirkət adı</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <div key={`company-${code}`}>
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <Input
                        value={formData.company_name[code] ?? ""}
                        onChange={e => handleLocalizedChange("company_name", code, e.target.value)}
                        placeholder={`${label} versiyası`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tagline / şüar</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <div key={`tagline-${code}`}>
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <Input
                        value={formData.tagline[code] ?? ""}
                        onChange={e => handleLocalizedChange("tagline", code, e.target.value)}
                        placeholder={`${label} şüarı`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Qısa təsvir</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <div key={`description-${code}`}>
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <Textarea
                        value={formData.description[code] ?? ""}
                        onChange={e => handleLocalizedChange("description", code, e.target.value)}
                        rows={3}
                        placeholder={`${label} təsviri`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Əlaqə məlumatları</CardTitle>
              <CardDescription>Telefon nömrələri, e-poçt ünvanları və ünvan məlumatları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Telefon nömrələri</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("phones")}>
                    <Plus className="w-4 h-4 mr-1" /> Nömrə əlavə et
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.phones.map((phone, index) => (
                    <div key={`phone-${index}`} className="flex items-center gap-2">
                      <Input
                        value={phone}
                        onChange={e => handleArrayChange("phones", index, e.target.value)}
                        placeholder="+994 (50) 123 45 67"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArrayItem("phones", index)}
                        disabled={formData.phones.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">E-poçt ünvanları</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("emails")}>
                    <Plus className="w-4 h-4 mr-1" /> E-poçt əlavə et
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.emails.map((email, index) => (
                    <div key={`email-${index}`} className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={e => handleArrayChange("emails", index, e.target.value)}
                        placeholder="info@carrentbaku.az"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArrayItem("emails", index)}
                        disabled={formData.emails.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">WhatsApp nömrələri</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("whatsapp_numbers")}>
                    <Plus className="w-4 h-4 mr-1" /> Nömrə əlavə et
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.whatsapp_numbers.map((number, index) => (
                    <div key={`whatsapp-${index}`} className="flex items-center gap-2">
                      <Input
                        value={number}
                        onChange={e => handleArrayChange("whatsapp_numbers", index, e.target.value)}
                        placeholder="+994501234567"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArrayItem("whatsapp_numbers", index)}
                        disabled={formData.whatsapp_numbers.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Əsas ünvan</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <div key={`address-${code}`}>
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <Input
                        value={formData.address[code] ?? ""}
                        onChange={e => handleLocalizedChange("address", code, e.target.value)}
                        placeholder={`${label} ünvanı`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Əlavə ünvan</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <div key={`address-secondary-${code}`}>
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <Input
                        value={formData.address_secondary[code] ?? ""}
                        onChange={e => handleLocalizedChange("address_secondary", code, e.target.value)}
                        placeholder={`${label} əlavə ünvanı`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Google Maps linki və ya embed URL</Label>
                <Input
                  value={formData.map_embed_url ?? ""}
                  onChange={e => setFormData(prev => ({ ...prev, map_embed_url: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ofis ünvanları</CardTitle>
              <CardDescription>Hər ofis üçün ayrıca ünvan və xəritə linki daxil edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.offices.map((office, index) => (
                <Card key={office.id} className="border border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                    <div>
                      <CardTitle className="text-lg">Ofis #{index + 1}</CardTitle>
                      <CardDescription>Hər dil üçün ofis adı və ünvanı</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOffice(office.id)}
                      disabled={formData.offices.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-5 mt-4">
                    <div className="space-y-2">
                      <Label>Ofis adı</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {LANGUAGE_OPTIONS.map(({ code, label }) => (
                          <div key={`${office.id}-label-${code}`}>
                            <Label className="text-xs text-muted-foreground">{label}</Label>
                            <Input
                              value={office.label[code] ?? ""}
                              onChange={e => handleOfficeLocalizedChange(office.id, "label", code, e.target.value)}
                              placeholder={`${label} ofis adı`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ofis ünvanı</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {LANGUAGE_OPTIONS.map(({ code, label }) => (
                          <div key={`${office.id}-address-${code}`}>
                            <Label className="text-xs text-muted-foreground">{label}</Label>
                            <Input
                              value={office.address[code] ?? ""}
                              onChange={e => handleOfficeLocalizedChange(office.id, "address", code, e.target.value)}
                              placeholder={`${label} ünvanı`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Xəritə (Google Maps linki və ya iframe)</Label>
                      <Textarea
                        value={office.map_embed_url ?? ""}
                        onChange={e => handleOfficeMapChange(office.id, e.target.value)}
                        placeholder="https://maps.google.com/..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Google Maps-dən "Paylaş" → "Xəritəni yerləşdir" bölməsini istifadə edə bilərsiniz.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={handleAddOffice}>
                <Plus className="w-4 h-4 mr-2" /> Ofis əlavə et
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İş saatları</CardTitle>
              <CardDescription>Şöbələrin iş saatlarını daxil edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {formData.office_hours.map((item, index) => (
                  <div key={`hours-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground">Başlıq</Label>
                      <Input
                        value={item.label}
                        onChange={e => handleOfficeHourChange(index, "label", e.target.value)}
                        placeholder="Bazar ertəsi - Şənbə"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground">Saatlar</Label>
                      <Input
                        value={item.value}
                        onChange={e => handleOfficeHourChange(index, "value", e.target.value)}
                        placeholder="09:00 - 21:00"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOfficeHour(index)}
                        disabled={formData.office_hours.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={handleAddOfficeHour}>
                <Plus className="w-4 h-4 mr-2" /> İş saatı əlavə et
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sosial şəbəkələr</CardTitle>
              <CardDescription>Aktiv sosial şəbəkə linklərini daxil edin</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["facebook", "instagram", "whatsapp", "telegram", "youtube", "tiktok", "linkedin"].map(key => (
                <div key={key}>
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={formData.social_links?.[key] ?? ""}
                    onChange={e => handleSocialLinkChange(key, e.target.value)}
                    placeholder={`https://${key}.com/`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/dashboard")}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yüklənir...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saxla
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminContactInfo;
