import { Suspense } from "react";
import UsersTableClient from "@/components/HomePage/UsersTableClient";
import TablePlaceholder from "@/components/shared/table-placeholder";
import { getUsers } from "@/actions/users/actions";

export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: users, startTime } = await getUsers();
  const duration = Date.now() - startTime;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<TablePlaceholder />}>
        <UsersTableClient users={users} duration={duration} />
      </Suspense>
    </main>
  );
}
