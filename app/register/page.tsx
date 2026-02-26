"use client";

import { register } from "@/lib/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setFieldErrors({});
    const result = await register(formData);
    if (result?.fieldErrors) {
      setFieldErrors(result.fieldErrors as Record<string, string[]>);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <h1 className="text-2xl font-bold text-brand-navy">KitStack</h1>
          <p className="text-gray-400 text-sm mt-1">Create Admin Account</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1.5"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="email@example.com"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400 text-sm ${fieldErrors.email ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400 text-sm ${fieldErrors.password ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1.5"
              htmlFor="clubName"
            >
              Club Name
            </label>
            <input
              id="clubName"
              type="text"
              name="clubName"
              placeholder="e.g. FC Antwerp"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400 text-sm ${fieldErrors.clubName ? "border-red-400" : "border-gray-300"}`}
              required
            />
            {fieldErrors.clubName ? (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.clubName[0]}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                This will be your primary club.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-navy-light hover:bg-brand-navy text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-green hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
