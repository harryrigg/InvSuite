import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
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

type LoginResponse = {
  redirect: string | null;
};

export const useAuth = ({
  middleware,
}: {
  middleware?: "guest" | "auth";
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
  const invalidateUser = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    [queryClient],
  );

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
      .post<LoginResponse>("/login", details)
      .then((resp) => {
        invalidateUser();
        if (resp.data.redirect) redirect(resp.data.redirect);
      })
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
  }, [invalidateUser, error]);

  useEffect(() => {
    if (middleware === "auth" && error) {
      logout();
      return;
    }

    if (middleware === "guest" && user) {
      if (user.email_verified_at) {
        return router.push("/dashboard");
      } else {
        return router.push("/verify-email");
      }
    }

    if (middleware === "auth" && user && !user.email_verified_at) {
      return router.push("/verify-email");
    }

    if (
      window.location.pathname === "/verify-email" &&
      user?.email_verified_at
    ) {
      return router.push("/dashboard");
    }
  }, [middleware, logout, router, user, error]);

  return {
    user,
    register,
    login,
    logout,
  };
};
