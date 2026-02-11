ALTER TABLE "account" ALTER COLUMN "access_token" SET DATA TYPE text USING "access_token"::text;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refresh_token" SET DATA TYPE text USING "refresh_token"::text;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id_token" SET DATA TYPE text USING "id_token"::text;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "token" SET DATA TYPE text USING "token"::text;--> statement-breakpoint
ALTER TABLE "sso_provider" ALTER COLUMN "oidc_config" SET DATA TYPE text USING "oidc_config"::text;--> statement-breakpoint
ALTER TABLE "sso_provider" ALTER COLUMN "saml_config" SET DATA TYPE text USING "saml_config"::text;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "value" SET DATA TYPE text USING "value"::text;