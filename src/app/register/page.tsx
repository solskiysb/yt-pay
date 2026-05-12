"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Auto-confirm is enabled, redirect to dashboard
    window.location.href = "/dashboard";
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10">
              <svg
                className="h-6 w-6 text-accent-gold"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link to activate your account.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-sm font-medium text-accent-gold hover:text-accent-gold-dark"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join YT Pay and start buying or selling classic cars
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-accent-gold text-white hover:bg-accent-gold-dark"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-accent-gold hover:text-accent-gold-dark"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
