"use client";

import Link from "next/link";
import { Form } from "@prisma/client";

type FormCardProps = {
  form: Form;
};

export default function FormCard({ form }: FormCardProps) {
  return (
    <Link
      href={`/dashboard/form-builder/${form.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-brand-green transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            form.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {form.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      <h2 className="text-lg font-bold text-brand-navy group-hover:text-brand-green transition-colors">
        {form.name}
      </h2>
      <p className="text-sm text-gray-500 mt-1">{form.targetGroup}</p>
    </Link>
  );
}
