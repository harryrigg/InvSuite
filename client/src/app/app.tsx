"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { z } from "zod";

import { errorMap } from "@/lib/error";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

export default function App({ children }: Props) {
  useEffect(() => {
    z.setErrorMap(errorMap);
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
