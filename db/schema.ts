import { pgTable, serial, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const properties = pgTable('scraped_properties', {
  id: serial('id').primaryKey(),
  projectName: text('project_name').notNull(),
  locality: text('locality').notNull().default(''),
  priceRange: text('price_range').notNull().default(''),
  area: text('area').notNull().default(''),
  propertyType: text('property_type').notNull().default(''),
  city: text('city').notNull(),
  url: text('url').notNull(),
  scrapedAt: timestamp('scraped_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex('properties_city_url').on(table.city, table.url), index('properties_city').on(table.city)]);
