import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { seed } from "drizzle-seed";
import postgres from "postgres";
import * as invitation from "../schema/invitation";
import * as items from "../schema/items";
import * as organization from "../schema/organization";
import * as passkey from "../schema/passkey";
import * as permissions from "../schema/permissions";
import * as team from "../schema/team";
import * as user from "../schema/user";

async function seedDatabase() {
  try {
    if (process.env.ENVIRONMENT === "production") {
      config({ path: "../../.env.prod" });
    } else {
      config({ path: "../../.env.local" });
    }

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error("Missing Environment Variable: DATABASE_URL");
    }

    console.log(DATABASE_URL);
    const sql = postgres(DATABASE_URL);
    const db = drizzle(sql, {
      casing: "snake_case",
    });

    // Read more about seeding here: https://orm.drizzle.team/docs/seed-overview#drizzle-seed
    // await seed(db, userSchema);
    // console.log("✅ User schema seeded successfully!");
    await seed(
      db,
      {
        user,
        invitation,
        organization,
        passkey,
        permissions,
        team,
        items,
      },
      { count: 10 },
    );
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
