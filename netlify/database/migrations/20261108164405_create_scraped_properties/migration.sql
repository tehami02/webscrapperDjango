CREATE TABLE "scraped_properties" (
	"id" serial PRIMARY KEY,
	"project_name" text NOT NULL,
	"locality" text DEFAULT '' NOT NULL,
	"price_range" text DEFAULT '' NOT NULL,
	"area" text DEFAULT '' NOT NULL,
	"property_type" text DEFAULT '' NOT NULL,
	"city" text NOT NULL,
	"url" text NOT NULL,
	"scraped_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "properties_city_url" ON "scraped_properties" ("city","url");--> statement-breakpoint
CREATE INDEX "properties_city" ON "scraped_properties" ("city");