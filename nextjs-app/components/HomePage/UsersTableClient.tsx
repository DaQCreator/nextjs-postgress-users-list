"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import RefreshButton from "../shared/refresh-button";
import { timeAgo } from "@/lib/serverUtils";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
};

interface UsersTableClientProps {
  users: User[];
  duration: number;
}

export default function UsersTableClient({
  users,
  duration,
}: UsersTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page")
    ? parseInt(searchParams.get("page") ?? "1", 10)
    : 1;

  const pageSize = 5;
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const currentPage = Math.max(
    1,
    Math.min(page, totalPages === 0 ? 1 : totalPages)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageUsers = users.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    router.push(`?page=${p}`);
  };

  return (
    <div className="bg-white/30 p-8 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      {/* Pasek nagłówkowy */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <p className="text-sm text-gray-500">Fetched in {duration}ms</p>
          <p className="text-sm text-gray-500">All users: {users.length}</p>
        </div>
        <div className="flex md:flex-col items-center gap-2">
          <RefreshButton />
          <Button
            variant="default"
            onClick={() => alert(`Create user disabled for You`)}
          >
            Create user
          </Button>
        </div>
      </div>

      {/* Wyświetlanie aktualnej strony użytkowników */}
      <div className="divide-y divide-gray-900/5">
        {pageUsers.map((user) => {
          const displayName = `${user.first_name} ${user.last_name}`;
          return (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 hover:bg-gray/10 hover:cursor-pointer"
            >
              <button
                className="space-y-1 w-full flex flex-col items-start "
                onClick={() => {
                  router.push(`/user/${user.id}`);
                }}
              >
                <p className="font-medium leading-none">{displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </button>

              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 min-w-fit">
                  {timeAgo(new Date(user.createdAt))}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-10">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/user/${user.id}`);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert(`Delete user: ${displayName}`)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === currentPage}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

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
