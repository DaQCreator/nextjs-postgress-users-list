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
import { MoreHorizontal } from "lucide-react";

// Typ adresu pobranego z bazy
type Address = {
  user_id: number;
  address_type: string;
  valid_from: string; // w SQL jest TIMESTAMP, w JS string
  post_code: string;
  city: string;
  country_code: string;
  street: string;
  building_number: string;
  created_at: string;
  updated_at: string;
};

// Typ użytkownika pobranego z bazy
type User = {
  id: number;
  first_name: string;
  last_name: string;
  initials: string;
  email: string;
  status: string;
  createdAt: string;
};

interface UserAddressesClientProps {
  user: User;
  addresses: Address[];
}

export default function UserAddressesClient({
  user,
  addresses,
}: UserAddressesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
        <Button variant="default" onClick={() => alert("Create address modal")}>
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
                      <DropdownMenuItem
                        onClick={() =>
                          alert(`Edit address: ${address_type} / ${valid_from}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          alert(
                            `Delete address: ${address_type} / ${valid_from}`
                          )
                        }
                      >
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
        <div className="flex justify-center">
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
    </div>
  );
}
