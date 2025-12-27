import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AgentPromptResponse {
  agent_name: string;
  final_prompt: string;
  updated_at: string | null;
}

const DEFAULT_PROMPT = "Müştərilərə CARRENTBAKU xidmətləri barədə səmimi və peşəkar cavablar ver.";

export const useAgentPrompt = () => {
  return useQuery<AgentPromptResponse | null>({
    queryKey: ["agent-config", "prompt"],
    queryFn: async () => {
      try {
        const response = await api.agent.getPrompt();
        if (!response) {
          return null;
        }
        return {
          agent_name: response.agent_name ?? "midiya-ai-chat",
          final_prompt: response.final_prompt?.trim() || DEFAULT_PROMPT,
          updated_at: response.updated_at ?? null,
        };
      } catch (error) {
        console.error("Error loading agent prompt", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
