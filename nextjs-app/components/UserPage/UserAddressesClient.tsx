"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

import AddressForm from "@/components/forms/AddressForm";
import { IAddress, IUser } from "@/types";
import { deleteAddresAction } from "@/actions/users/address/action";

interface UserAddressesClientProps {
  user: IUser;
  addresses: IAddress[];
}

export default function UserAddressesClient({
  user,
  addresses,
}: UserAddressesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAddress, setSelectedAddress] =
    useState<Partial<IAddress> | null>(null);

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedAddress(null);
    setOpenModal(true);
  };

  const handleEditClick = (addr: IAddress) => {
    setModalMode("edit");
    setSelectedAddress(addr);
    setOpenModal(true);
  };

  const handleDeleteClick = async (addr: IAddress) => {
    try {
      await deleteAddresAction({
        userId: user.id,
        addressType: addr.address_type,
      });

      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete address:", err);
      alert(`Error deleting address: ${err.message}`);
    }
  };

  const currentPageParam = Number(searchParams.get("page")) || 1;
  const [pageSize] = useState(3);

  const total = addresses.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.max(
    1,
    Math.min(currentPageParam, totalPages === 0 ? 1 : totalPages)
  );
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAddresses = addresses.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  return (
    <div className="bg-white/30 p-8 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mb-2 font-bold">
          {user
            ? `${user.first_name} ${user.last_name} – Addresses`
            : "No user"}
        </h1>
        <Button variant="default" onClick={handleCreateClick}>
          Create Address
        </Button>
      </div>

      <div className="divide-y divide-gray-200 bg-white/30 p-4 rounded">
        {currentAddresses.length === 0 ? (
          <div className="text-sm text-gray-500 p-2">No addresses found.</div>
        ) : (
          currentAddresses.map((addr) => {
            const { address_type, valid_from, street, building_number } = addr;
            const displayName = `${street} ${building_number}`;
            return (
              <div
                key={`${address_type}-${valid_from}`}
                className="flex justify-between py-3"
              >
                <div className="w-full">
                  <p className="font-medium">{address_type}</p>
                  <p className="text-sm text-gray-500">{displayName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditClick(addr)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(addr)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(currentPage - 1)}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(currentPage + 1)}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "Create Address" : "Edit Address"}
            </DialogTitle>
          </DialogHeader>

          <AddressForm
            userId={user.id}
            mode={modalMode}
            oldAddressType={selectedAddress?.address_type}
            oldValidFrom={selectedAddress?.valid_from}
            defaultValues={
              modalMode === "edit"
                ? {
                    addressType: selectedAddress?.address_type,
                    validFrom: selectedAddress?.valid_from,
                    postCode: selectedAddress?.post_code,
                    city: selectedAddress?.city,
                    countryCode: selectedAddress?.country_code,
                    street: selectedAddress?.street,
                    buildingNumber: selectedAddress?.building_number,
                  }
                : undefined
            }
            onSuccess={() => {
              setOpenModal(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
