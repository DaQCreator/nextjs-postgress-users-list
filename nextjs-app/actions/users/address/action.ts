"use server";

import { sql } from "@/lib/db";
import { seed } from "@/lib/seed";

export async function createAddressAction(data: {
  userId: number;
  addressType: string;
  validFrom: string; // "YYYY-MM-DD" albo "2025-01-01T12:34"
  postCode: string;
  city: string;
  countryCode: string;
  street: string;
  buildingNumber: string;
}) {
  if (data.countryCode.length !== 3) {
    throw new Error(
      "Invalid country code. Must have length 3 (ISO3166-1 alpha-3)."
    );
  }

  try {
    await sql`
      INSERT INTO users_addresses (
        user_id,
        address_type,
        valid_from,
        post_code,
        city,
        country_code,
        street,
        building_number
      )
      VALUES (
        ${data.userId},
        ${data.addressType},
        ${data.validFrom}::timestamp,
        ${data.postCode},
        ${data.city},
        ${data.countryCode},
        ${data.street},
        ${data.buildingNumber}
      )
    `;
  } catch (err: any) {
    if (err.message.includes('relation "users_addresses" does not exist')) {
      await seed();
      return createAddressAction(data);
    }
    throw err;
  }
}

export async function editAddressAction(data: {
  userId: number;
  oldAddressType: string;
  oldValidFrom: string;
  addressType: string;
  validFrom: string;
  postCode: string;
  city: string;
  countryCode: string;
  street: string;
  buildingNumber: string;
}) {
  if (data.countryCode.length !== 3) {
    throw new Error("Invalid country code. Must have length 3.");
  }

  try {
    await sql`
      UPDATE users_addresses
      SET
        address_type = ${data.addressType},
        valid_from = ${data.validFrom}::timestamp,
        post_code = ${data.postCode},
        city = ${data.city},
        country_code = ${data.countryCode},
        street = ${data.street},
        building_number = ${data.buildingNumber}
      WHERE user_id = ${data.userId}
        AND address_type = ${data.oldAddressType}
        AND valid_from = ${data.oldValidFrom}::timestamp
    `;
  } catch (err: any) {
    throw err;
  }
}

export async function deleteAddresAction({
  userId,
  addressType,
}: {
  userId: number;
  addressType: string;
}) {
  try {
    await sql`
      DELETE FROM users_addresses
      WHERE user_id = ${userId}
        AND address_type = ${addressType}
    `;
    console.log("Deleted address", addressType);
  } catch (err: any) {
    throw err;
  }
}
