import { Suspense } from "react";
import { getUserById, getUserAddresses } from "@/actions/users/actions";
import TablePlaceholder from "@/components/shared/table-placeholder";
import UserAddressesClient from "@/components/UserPage/UserAddressesClient";
import { GoToHomePage } from "@/components/shared/go-to-homepage-button";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  if (Number.isNaN(userId)) {
    return (
      <main>
        <h1>Invalid User ID: {resolvedParams.id}</h1>
      </main>
    );
  }

  const user = await getUserById(userId);
  const addresses = await getUserAddresses(userId);

  return (
    <main className="min-h-screen p-4">
      <GoToHomePage />
      <Suspense fallback={<TablePlaceholder />}>
        <UserAddressesClient user={user} addresses={addresses} />
      </Suspense>
    </main>
  );
}
