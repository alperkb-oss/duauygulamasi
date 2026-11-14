import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-emerald-950/40 border border-emerald-800/40 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
      />
    </div>
  );
}

export function FilterRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">{children}</div>;
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-gold-400 text-midnight-950'
          : 'bg-emerald-950/40 text-midnight-300 border border-emerald-800/40 hover:text-midnight-100'
      }`}
    >
      {children}
    </button>
  );
}
