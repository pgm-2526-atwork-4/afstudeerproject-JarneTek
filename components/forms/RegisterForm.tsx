"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth";
import Link from "next/link";
import LoadingButton from "@/components/ui/LoadingButton";

export default function RegisterForm() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setFieldErrors({});
    const result = await register(formData);
    if (result?.fieldErrors) {
      setFieldErrors(result.fieldErrors as Record<string, string[]>);
    }
  };

  return (
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
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400 text-sm pr-14 ${fieldErrors.password ? "border-red-400" : "border-gray-300"}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-green hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
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

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1.5"
            htmlFor="iban"
          >
            IBAN
            <span className="text-xs font-normal text-gray-400 italic">
              (optional)
            </span>
          </label>
          <input
            id="iban"
            type="text"
            name="iban"
            placeholder="BE00 0000 0000 0000"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all placeholder:text-gray-400 text-sm uppercase ${fieldErrors.iban ? "border-red-400" : "border-gray-300"}`}
          />
          {fieldErrors.iban ? (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.iban[0]}</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              Will be used for Payconiq payments (can be set later).
            </p>
          )}
        </div>

        <LoadingButton
          type="submit"
          loadingText="Creating..."
          className="w-full bg-brand-navy-light hover:bg-brand-navy text-white font-medium py-3 rounded-lg mt-2"
        >
          Create Account
        </LoadingButton>
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
  );
}
