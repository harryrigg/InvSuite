"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

import { useAuth } from "@/hooks/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Page() {
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      () => {
        form.setError("email", {
          type: "custom",
          message: "Invalid email or password",
        });
      },
    );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl/9 font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[400px] space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/login/forgot"
                    className="link-primary text-sm font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <FormInput type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="primary" className="w-full font-bold">
            Sign in
          </Button>
        </form>
      </Form>
      <p className="mt-10 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="link-primary font-semibold">
          Create one
        </Link>
      </p>
    </div>
  );
}
