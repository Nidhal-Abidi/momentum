import type { DomainColor } from "@/lib/types";

interface ColorPickerProps {
  value: DomainColor;
  onChange: (color: DomainColor) => void;
}

const colors: { name: DomainColor; class: string; border: string }[] = [
  { name: "lime", class: "bg-lime-500", border: "ring-lime-500" },
  { name: "blue", class: "bg-blue-500", border: "ring-blue-500" },
  { name: "purple", class: "bg-purple-500", border: "ring-purple-500" },
  { name: "emerald", class: "bg-emerald-500", border: "ring-emerald-500" },
  { name: "orange", class: "bg-orange-500", border: "ring-orange-500" },
  { name: "red", class: "bg-red-500", border: "ring-red-500" },
  { name: "pink", class: "bg-pink-500", border: "ring-pink-500" },
  { name: "cyan", class: "bg-cyan-500", border: "ring-cyan-500" },
  { name: "amber", class: "bg-amber-500", border: "ring-amber-500" },
  { name: "indigo", class: "bg-indigo-500", border: "ring-indigo-500" },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onChange(color.name)}
          className={`
            w-10 h-10 rounded-full ${color.class}
            ring-2 ring-offset-2 dark:ring-offset-stone-900
            transition-all duration-200
            ${
              value === color.name
                ? `${color.border} scale-110`
                : "ring-transparent hover:scale-105"
            }
          `}
          aria-label={`Select ${color.name} color`}
        />
      ))}
    </div>
  );
}
