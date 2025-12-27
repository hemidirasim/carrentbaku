-- CreateTable
CREATE TABLE "AgentConfig" (
    "id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "api_token" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentConfig_pkey" PRIMARY KEY ("id")
);

CREATE OR REPLACE FUNCTION update_agentconfig_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agentconfig_updated_at ON "AgentConfig";
CREATE TRIGGER agentconfig_updated_at
BEFORE UPDATE ON "AgentConfig"
FOR EACH ROW EXECUTE FUNCTION update_agentconfig_updated_at();
