"use client";

import { useRouter } from "next/navigation";

export const GoToHomePage = () => {
  const router = useRouter();
  return (
    <div className="container flex items-center justify-center">
      <button
        className="text-sm text-center mb-4 text-gray-500 hover:text-gray-900"
        onClick={() => {
          router.push("/");
        }}
      >
        🔙 Go to All Users
      </button>
    </div>
  );
};
