"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "../../_components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/matches", label: "Matches" },
    { href: "/matches?status=live", label: "Live", isLive: true },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
];

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href.split("?")[0]);

    return (
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white font-black text-sm">
                                S
                            </span>
                            <span className="text-base font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                                Soft<span className="text-green-600">Buzz</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1 justify-self-center">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                                    ${link.isLive
                                        ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10"
                                        : isActive(link.href)
                                            ? "text-foreground bg-foreground/5"
                                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                            >
                                {link.isLive && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                    </span>
                                )}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 md:justify-self-end">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/user/dashboard" className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <span className="h-7 w-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                                        {user.username?.[0]}
                                    </span>
                                    <span className="hidden md:block text-sm font-medium">{user.username}</span>
                                </Link>
                                <button onClick={logout}
                                    className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors">
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/login"
                                    className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register"
                                    className="h-9 px-3 inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors">
                                    Sign up
                                </Link>
                            </div>
                        )}

                        <ThemeToggle />

                        {/* Mobile hamburger */}
                        <button type="button" onClick={() => setOpen(v => !v)} aria-label="Toggle menu"
                            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/15 hover:bg-foreground/5 transition-colors">
                            {open ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={"md:hidden overflow-hidden transition-[max-height] duration-300 " + (open ? "max-h-96" : "max-h-0")}>
                    <div className="pb-4 pt-2 border-t border-black/10 dark:border-white/10">
                        <div className="flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 flex items-center gap-2 ${
                                        link.isLive
                                            ? "text-green-600 dark:text-green-400"
                                            : isActive(link.href)
                                                ? "text-foreground bg-foreground/5"
                                                : "text-foreground/70"
                                    }`}>
                                    {link.isLive && (
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                        </span>
                                    )}
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <div className="mt-2 flex gap-2 px-1">
                                    <Link href="/login" onClick={() => setOpen(false)}
                                        className="flex-1 h-9 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors">
                                        Log in
                                    </Link>
                                    <Link href="/register" onClick={() => setOpen(false)}
                                        className="flex-1 h-9 inline-flex items-center justify-center rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}