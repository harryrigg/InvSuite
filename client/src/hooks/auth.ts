import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import api from "@/lib/api";
import { User } from "@/lib/types/utils";

type RegisterDetails = {
  name: string;
  business_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type LoginDetails = {
  email: string;
  password: string;
};

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: "guest" | "auth";
  redirectIfAuthenticated?: string;
} = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, error } = useQuery<User, AxiosError>({
    queryKey: ["user"],
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      return api.get<User>("/api/user").then((res) => res.data);
    },
  });
  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user"] });

  const csrf = () => api.get("/sanctum/csrf-cookie");

  const register = async (
    details: RegisterDetails,
    onEmailTakenError: () => void,
  ) => {
    await csrf();

    api
      .post("/register", details)
      .then(() => invalidateUser())
      .catch((e) => {
        if (!e.response?.data?.errors?.email) throw e;
        onEmailTakenError();
      });
  };

  const login = async (details: LoginDetails, onError: () => void) => {
    await csrf();

    api
      .post("/login", details)
      .then(() => invalidateUser())
      .catch((e) => {
        if (e.response?.status !== 422) throw e;

        onError();
      });
  };

  const logout = useCallback(async () => {
    if (!error) {
      await api.post("/logout").then(() => invalidateUser());
    }

    window.location.pathname = "/login";
  }, [error]);

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === "auth" && error) logout();
  }, [middleware, redirectIfAuthenticated, logout, router, user, error]);

  return {
    user,
    register,
    login,
    logout,
  };
};
