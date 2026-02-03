import { cn } from "@/lib/utils";

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
) {
  const { className, label, ...rest } = props;
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs font-semibold text-zinc-700">{label}</span> : null}
      <input
        {...rest}
        className={cn(
          "h-11 rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm text-zinc-900 shadow-sm",
          "outline-none focus:border-zinc-300 focus:ring-2 focus:ring-[color-mix(in_oklab,var(--tenant-accent),white_70%)]",
          className
        )}
      />
    </label>
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
) {
  const { className, label, ...rest } = props;
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs font-semibold text-zinc-700">{label}</span> : null}
      <textarea
        {...rest}
        className={cn(
          "min-h-[120px] rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-900 shadow-sm",
          "outline-none focus:border-zinc-300 focus:ring-2 focus:ring-[color-mix(in_oklab,var(--tenant-accent),white_70%)]",
          className
        )}
      />
    </label>
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
) {
  const { className, label, ...rest } = props;
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs font-semibold text-zinc-700">{label}</span> : null}
      <select
        {...rest}
        className={cn(
          "h-11 rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm text-zinc-900 shadow-sm",
          "outline-none focus:border-zinc-300 focus:ring-2 focus:ring-[color-mix(in_oklab,var(--tenant-accent),white_70%)]",
          className
        )}
      />
    </label>
  );
}
