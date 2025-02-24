"use server";
import postgres from "postgres";
import { seed } from "@/lib/seed";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "prefer" });

export async function getUsers() {
  let data;
  let startTime = Date.now();

  try {
    data = await sql<
      {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        createdAt: string; // alias created_at
      }[]
    >`
      SELECT 
        id,
        first_name,
        last_name,
        initials,
        email,
        status,
        created_at AS "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;
  } catch (e: any) {
    if (e.message.includes('relation "users" does not exist')) {
      console.log("Table 'users' does not exist, creating and seeding now...");
      await seed();
      startTime = Date.now();

      data = await sql<
        {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          createdAt: string;
        }[]
      >`
        SELECT 
          id,
          first_name,
          last_name,
          initials,
          email,
          status,
          created_at AS "createdAt"
        FROM users
        ORDER BY created_at DESC
      `;
    } else {
      throw e;
    }
  }

  return { data, startTime };
}
