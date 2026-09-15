// src/components/common/UserAvatar.tsx
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className = "w-10 h-10",
  fallbackClassName,
}: UserAvatarProps) {
  const initials =
    (name || "?")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <Avatar className={cn("shrink-0 shadow-xs border border-white/40", className)}>
      {src && (
        <AvatarImage
          src={src}
          alt={name || "Avatar"}
          className="object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-700 font-bold select-none",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
