"use client";

import { useFormStatus } from "react-dom";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function LoadingButton({
  loadingText,
  children,
  className = "",
  disabled,
  isLoading = false,
  ...props
}: LoadingButtonProps) {
  const { pending } = useFormStatus();
  const isPending = pending || isLoading;

  return (
    <button
      {...props}
      disabled={isPending || disabled}
      className={`${className} transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {isPending ? (
        <>
          <div className="spinner" />
          <span>{loadingText || "Loading..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
