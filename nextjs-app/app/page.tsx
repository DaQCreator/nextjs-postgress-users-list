import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/table";
import TablePlaceholder from "@/components/table-placeholder";
import ExpandingArrow from "@/components/expanding-arrow";
import { getUsers } from "@/actions/users/actions";

export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: users, startTime } = await getUsers();
  const duration = Date.now() - startTime;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<TablePlaceholder />}>
        <Table users={users} duration={duration} />
      </Suspense>
    </main>
  );
}
