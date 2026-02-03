import Link from "next/link";
import { cn } from "@/lib/utils";

type Common = {
  className?: string;
  children: React.ReactNode;
};

export function Button({
  className,
  children,
  variant = "primary",
  ...props
}: Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-accent)] focus-visible:ring-offset-2",
        variant === "primary" &&
          "btn-primary shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10",
        variant === "secondary" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        (props.disabled || props["aria-disabled"]) && "opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  children,
  variant = "primary",
}: Common & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tenant-accent)] focus-visible:ring-offset-2",
        variant === "primary" &&
          "btn-primary shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10",
        variant === "secondary" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        className
      )}
    >
      {children}
    </Link>
  );
}
