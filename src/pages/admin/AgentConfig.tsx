import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Bot, Info, Loader2, Save } from "lucide-react";

import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AgentConfigResponse {
  id: string | null;
  agent_name: string;
  api_token: string;
  instructions: string;
  company_name: string;
  site_url: string;
  agent_endpoint?: string | null;
  project_id?: string | null;
  database_id?: string | null;
  knowledge_base_id?: string | null;
  embedding_model_id?: string | null;
  final_prompt?: string;
  updated_at?: string | null;
}

interface AgentConfigForm {
  agent_name: string;
  api_token: string;
  instructions: string;
  company_name: string;
  site_url: string;
  agent_endpoint: string;
  project_id: string;
  database_id: string;
  knowledge_base_id: string;
  embedding_model_id: string;
}

const createDefaultForm = (): AgentConfigForm => ({
  agent_name: "midiya-ai-chat",
  api_token: "",
  instructions: "",
  company_name: "CARRENTBAKU",
  site_url: "https://carrentbaku.az",
  agent_endpoint: "https://xwwxqujbyxojtvb5qzrflqgu.agents.do-ai.run",
  project_id: "11f0c06e-45d7-a6fc-b074-4e013e2ddde4",
  database_id: "0bbb8d8a-f88e-4686-87b4-c1050783ae86",
  knowledge_base_id: "14cffe65-c07a-11f0-b074-4e013e2ddde4",
  embedding_model_id: "18bc9b8f-73c5-11f0-b074-4e013e2ddde4",
});

const AdminAgentConfig = () => {
  const navigate = useNavigate();
  const { user: _user } = useAdmin();

  const [formData, setFormData] = useState<AgentConfigForm>(() => createDefaultForm());
  const [initialData, setInitialData] = useState<AgentConfigForm>(() => createDefaultForm());
  const [finalPrompt, setFinalPrompt] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        setLoading(true);
        const data: AgentConfigResponse = await api.agent.get();
        if (!isMounted || !data) {
          return;
        }
        const next: AgentConfigForm = {
          agent_name: data.agent_name ?? "",
          api_token: data.api_token ?? "",
          instructions: data.instructions ?? "",
          company_name: data.company_name ?? "",
          site_url: data.site_url ?? "",
          agent_endpoint: data.agent_endpoint ?? "",
          project_id: data.project_id ?? "",
          database_id: data.database_id ?? "",
          knowledge_base_id: data.knowledge_base_id ?? "",
          embedding_model_id: data.embedding_model_id ?? "",
        };
        setFormData(next);
        setInitialData(next);
        setFinalPrompt(data.final_prompt ?? "");
        setLastUpdated(data.updated_at ?? null);
      } catch (error) {
        console.error("Error loading agent config:", error);
        toast.error("Agent məlumatları yüklənmədi");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const isDirty = useMemo(() => {
    return (
      formData.agent_name !== initialData.agent_name ||
      formData.api_token !== initialData.api_token ||
      formData.instructions !== initialData.instructions ||
      formData.company_name !== initialData.company_name ||
      formData.site_url !== initialData.site_url ||
      formData.agent_endpoint !== initialData.agent_endpoint ||
      formData.project_id !== initialData.project_id ||
      formData.database_id !== initialData.database_id ||
      formData.knowledge_base_id !== initialData.knowledge_base_id ||
      formData.embedding_model_id !== initialData.embedding_model_id
    );
  }, [formData, initialData]);

  const handleChange = (field: keyof AgentConfigForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        agent_name: formData.agent_name.trim(),
        api_token: formData.api_token.trim(),
        instructions: formData.instructions.trim(),
        company_name: formData.company_name.trim(),
        site_url: formData.site_url.trim(),
        agent_endpoint: formData.agent_endpoint.trim(),
        project_id: formData.project_id.trim(),
        database_id: formData.database_id.trim(),
        knowledge_base_id: formData.knowledge_base_id.trim(),
        embedding_model_id: formData.embedding_model_id.trim(),
      };

      const response: AgentConfigResponse = await api.agent.update(payload);
      const normalizedPayload: AgentConfigForm = {
        agent_name: payload.agent_name,
        api_token: payload.api_token,
        instructions: payload.instructions,
        company_name: payload.company_name,
        site_url: payload.site_url,
        agent_endpoint: payload.agent_endpoint,
        project_id: payload.project_id,
        database_id: payload.database_id,
        knowledge_base_id: payload.knowledge_base_id,
        embedding_model_id: payload.embedding_model_id,
      };

      setInitialData(normalizedPayload);
      setFormData(normalizedPayload);
      setFinalPrompt(response.final_prompt ?? "");
      setLastUpdated(response.updated_at ?? null);
      toast.success("Agent təlimatı yeniləndi");
    } catch (error) {
      console.error("Error saving agent config:", error);
      toast.error("Agent təlimatını saxlamaq mümkün olmadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bot className="w-6 h-6 text-primary" />
                  AI Agent Təlimatları
                </h1>
                <p className="text-muted-foreground">
                  DigitalOcean agenti üçün ad, token və təlimatları idarə edin
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Agent Konfiqurasiyası</CardTitle>
            <CardDescription>
              Təlimatlar avtomatik olaraq şirkət adı və sayt URL-i ilə birlikdə agentə göndəriləcək
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent_name">Agent adı</Label>
                    <Input
                      id="agent_name"
                      value={formData.agent_name}
                      onChange={event => handleChange("agent_name", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Şirkət adı</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={event => handleChange("company_name", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_url">Sayt URL</Label>
                    <Input
                      id="site_url"
                      type="url"
                      value={formData.site_url}
                      onChange={event => handleChange("site_url", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_token">API token</Label>
                    <Input
                      id="api_token"
                      type="password"
                      value={formData.api_token}
                      onChange={event => handleChange("api_token", event.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      DigitalOcean AI agent panelində təqdim edilən token dəyərini daxil edin.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Agent təlimatı</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={event => handleChange("instructions", event.target.value)}
                    rows={10}
                    placeholder="Agentin cavab üslubu və xidmət qaydaları barədə təlimatlar..."
                    required
                  />
                </div>

                <div className="space-y-4 rounded-lg border border-dashed border-border p-4">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                      <Info className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">DigitalOcean parametrləri</h3>
                      <p className="text-xs text-muted-foreground">
                        Agent endpoint-i, layihə və knowledge base identifikatorlarını burada yeniləyin. Bu məlumatlar
                        chat botun düzgün modeldən istifadə etməsi üçün tələb olunur.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agent_endpoint">Agent endpoint URL</Label>
                      <Input
                        id="agent_endpoint"
                        type="url"
                        placeholder="https://xxxxx.agents.do-ai.run"
                        value={formData.agent_endpoint}
                        onChange={event => handleChange("agent_endpoint", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project_id">Project ID</Label>
                      <Input
                        id="project_id"
                        value={formData.project_id}
                        onChange={event => handleChange("project_id", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="database_id">Database ID</Label>
                      <Input
                        id="database_id"
                        value={formData.database_id}
                        onChange={event => handleChange("database_id", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="knowledge_base_id">Knowledge Base ID</Label>
                      <Input
                        id="knowledge_base_id"
                        value={formData.knowledge_base_id}
                        onChange={event => handleChange("knowledge_base_id", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="embedding_model_id">Embedding Model ID</Label>
                      <Input
                        id="embedding_model_id"
                        value={formData.embedding_model_id}
                        onChange={event => handleChange("embedding_model_id", event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Hazırkı model ID: <code className="font-mono">18bc9b8f-73c5-11f0-b074-4e013e2ddde4</code>
                      </p>
                    </div>
                  </div>
                </div>

                {finalPrompt && (
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="text-sm font-semibold mb-2">Agentə göndərilən yekun təlimat</h3>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {finalPrompt}
                    </pre>
                  </div>
                )}

                {lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Son yenilənmə: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={handleReset} disabled={!isDirty || saving}>
                    Sıfırla
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Yadda saxlanır...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Yadda saxla
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAgentConfig;
