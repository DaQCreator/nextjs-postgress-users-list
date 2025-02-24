import { Suspense } from "react";
import { getUserById, getUserAddresses } from "@/actions/users/actions";
import TablePlaceholder from "@/components/shared/table-placeholder";
import UserAddressesClient from "@/components/UserPage/UserAddressesClient";
import { GoToHomePage } from "@/components/shared/go-to-homepage-button";

export const dynamic = "force-dynamic";

export default async function UserPage({ params }: { params: { id: string } }) {
  const userId = Number((await params).id);
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
