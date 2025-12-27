-- Extend AgentConfig with DigitalOcean agent metadata
ALTER TABLE "AgentConfig"
  ADD COLUMN "agent_endpoint" TEXT,
  ADD COLUMN "project_id" TEXT,
  ADD COLUMN "database_id" TEXT,
  ADD COLUMN "knowledge_base_id" TEXT,
  ADD COLUMN "embedding_model_id" TEXT;
