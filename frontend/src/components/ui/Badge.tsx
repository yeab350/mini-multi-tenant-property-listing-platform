import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "accent" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-zinc-100 text-zinc-700",
        tone === "accent" &&
          "bg-[color-mix(in_oklab,var(--tenant-accent),white_85%)] text-[var(--tenant-accent)]",
        tone === "danger" && "bg-red-100 text-red-700",
        className
      )}
    >
      {children}
    </span>
  );
}
