import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  outline?: boolean;
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-24 h-24 text-2xl",
};

export function UserAvatar({
  src,
  name,
  size = "md",
  className,
  outline = true,
}: UserAvatarProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center shrink-0 overflow-hidden font-bold transition-all",
        "bg-brand-gold/10 text-brand-gold",
        outline && "border border-brand-gold/30",
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? "Avatar"}
          fill
          className="object-cover w-full h-full"
        />
      ) : name ? (
        <span>{initials}</span>
      ) : (
        <User className={cn("text-brand-gold/40", size === "xs" ? "w-3 h-3" : "w-1/2 h-1/2")} />
      )}
    </div>
  );
}
