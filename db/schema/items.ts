import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const collections = pgTable("collections", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const fields = pgTable(
  "fields",
  {
    id: uuid().primaryKey().defaultRandom(),
    collectionId: uuid()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(), //Phone Number
    key: text().notNull(), //phone_number
    type: text().notNull(),
    options: jsonb().$type<Record<string, unknown>>(),
  },
  (table) => [
    //Prevent duplicate field key within the same collection
    uniqueIndex("collection_field_key_unique").on(
      table.collectionId,
      table.key,
    ),
  ],
);

export type Field = typeof fields.$inferSelect;
export type NewField = typeof fields.$inferInsert;

export const entries = pgTable(
  "entries",
  {
    id: uuid().primaryKey().defaultRandom(),
    collectionId: uuid()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    content: jsonb().$type<Record<string, unknown>>().notNull(),
    status: text().notNull().default("draft"),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
    createdBy: uuid().references(() => user.id, { onDelete: "set null" }),
    updatedBy: uuid().references(() => user.id),
  },
  (table) => [index("collection_index").on(table.collectionId)],
);

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
