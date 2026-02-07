"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function UserNav() {
  const { logout, email, role } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Tentukan Badge berdasarkan Role
  const getBadge = () => {
    if (role === "enterprise") {
      return (
        <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-900 z-10 shadow-sm">
          ENT
        </span>
      );
    }
    if (role === "premium") {
      return (
        <span className="absolute -top-1 -right-2 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-900 z-10 shadow-sm">
          PRE
        </span>
      );
    }
    // Default Free
    return (
      <span className="absolute -top-1 -right-2 bg-zinc-600 text-zinc-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-900 z-10 shadow-sm">
        FREE
      </span>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full focus:ring-0"
        >
          {/* Wrapper Relative untuk Badge Positioning */}
          <div className="relative">
            <Avatar className="h-10 w-10 border border-zinc-700">
              <AvatarImage src="/avatars/01.png" alt="@user" />
              <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                {email?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            {/* Render Badge di sini */}
            {getBadge()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              My Account
            </p>
            <p className="text-xs leading-none text-zinc-400">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="focus:bg-zinc-800 focus:text-white cursor-pointer"
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="focus:bg-zinc-800 focus:text-white cursor-pointer"
          >
            Billing & Subscription
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="focus:bg-zinc-800 focus:text-white cursor-pointer"
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 focus:bg-red-900/20 focus:text-red-400 cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
