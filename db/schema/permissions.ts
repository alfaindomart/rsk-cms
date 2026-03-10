import { boolean, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { collections } from "./items";
import { roles } from "./user";

export const permissions = pgTable(
  "permissions",
  {
    id: uuid().primaryKey().defaultRandom(),
    roleId: uuid()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    collectionId: uuid()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    canCreate: boolean().notNull().default(false),
    canRead: boolean().notNull().default(true),
    canUpdate: boolean().notNull().default(false),
    canDelete: boolean().notNull().default(false),
  },
  (table) => [
    //Prevent duplicate rules for the same Role+Collection pair
    uniqueIndex("role_collection_unique").on(table.roleId, table.collectionId),
  ],
);

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
