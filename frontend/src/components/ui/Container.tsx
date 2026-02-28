import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  size = "wide",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "wide" | "full" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        "px-[clamp(1.25rem,4vw,3rem)]",
        size === "narrow" && "max-w-6xl",
        size === "wide" && "max-w-[90rem]",
        size === "full" && "max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
