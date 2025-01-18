"use client";

import { useAuth } from "@/hooks/auth";

export default function Page() {
  useAuth({
    middleware: "auth",
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl/9 font-bold tracking-tight text-gray-900">
        Email verification required
      </h1>
      <p className="mt-2 text-sm text-gray-500 max-w-[500px] text-center">
        Thanks for signing up! Before getting started, you need to verify your
        email address by clicking the link in the email we sent you.
      </p>
    </div>
  );
}
