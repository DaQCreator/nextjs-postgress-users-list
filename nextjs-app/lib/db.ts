import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "prefer",
  max: 5,
});

export { sql };
