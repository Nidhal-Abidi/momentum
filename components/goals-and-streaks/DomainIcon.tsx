import * as Icons from "lucide-react";
import { getColorClasses } from "@/lib/colorUtils";

interface DomainIconProps {
  emoji: string;
  color: string;
}

export function DomainIcon({ emoji, color }: DomainIconProps) {
  // Try to get the icon from lucide-react
  const IconComponent = (Icons as any)[emoji];
  const colors = getColorClasses(color);

  return (
    <div
      className={`flex items-center justify-center size-12 rounded-xl ${colors.bgLight}`}
    >
      {IconComponent ? (
        <IconComponent className={`size-6 ${colors.text}`} />
      ) : (
        <span className="text-2xl">{emoji}</span>
      )}
    </div>
  );
}

