"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const [pending, setTransition] = useTransition()
    const [error, setError] = useState<string | null>(null);

    const submit = async (values: LoginData) => {
        setError(null);
        setTransition(async () => {
            try {
                const response = await handleLogin(values);
                if (!response.success) {
                    throw new Error(response.message);
                }
                if (response.success) {
                    if (response.data?.role == 'admin') {
                        return router.replace("/admin");
                    }
                    if (response.data?.role === 'user') {
                        return router.replace("/user/dashboard");
                    }
                    return router.replace("/");
                } else {
                    setError('Login failed');
                }
            } catch (err: Error | any) {
                setError(err.message || 'Login failed');
            }
        })
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("email")}
                    placeholder="you@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("password")}
                    placeholder="••••••"
                />
                {errors.password?.message && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting || pending ? "Logging in..." : "Log in"}
            </button>

            <div className="mt-1 text-center text-sm">
                Don't have an account? <Link href="/register" className="font-semibold hover:underline">Sign up</Link>
            </div>
            <div className="mt-1 text-center text-sm">
                <Link href="/forget-password" className="font-semibold hover:underline">Forgot Password?</Link>
            </div>
        </form>
    );
}
