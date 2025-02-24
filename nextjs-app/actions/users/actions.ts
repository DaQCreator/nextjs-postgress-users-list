"use server";

import { seed } from "@/lib/seed";
import { sql } from "@/lib/db";
import { IAddress, IUser } from "@/types";

export async function getUsers() {
  let data: IUser[];
  let startTime = Date.now();

  try {
    data = await sql<
      {
        id: number;
        first_name: string;
        last_name: string;
        initials: string;
        email: string;
        status: string;
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
          initials: string;
          email: string;
          status: string;
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

export async function getUserById(id: number) {
  try {
    const [user] = await sql<
      {
        id: number;
        first_name: string;
        last_name: string;
        initials: string;
        email: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      }[]
    >`
      SELECT 
        id,
        first_name,
        last_name,
        initials,
        email,
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    return user as IUser;
  } catch (e: any) {
    if (e.message.includes('relation "users" does not exist')) {
      await seed();
      return getUserById(id);
    }
    throw e;
  }
}

export async function getUserAddresses(userId: number) {
  try {
    const data = await sql<
      {
        user_id: number;
        address_type: "HOME" | "INVOICE" | "POST" | "WORK";
        valid_from: string;
        post_code: string;
        city: string;
        country_code: string;
        street: string;
        building_number: string;
        created_at: string;
        updated_at: string;
      }[]
    >`
      SELECT
        user_id,
        address_type,
        valid_from,
        post_code,
        city,
        country_code,
        street,
        building_number,
        created_at,
        updated_at
      FROM users_addresses
      WHERE user_id = ${userId}
      ORDER BY valid_from DESC
    `;
    return data as IAddress[];
  } catch (e: any) {
    if (e.message.includes('relation "users_addresses" does not exist')) {
      await seed();
      return getUserAddresses(userId);
    }
    throw e;
  }
}
