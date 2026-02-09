"use client";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Appbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-border/40 bg-background/20 backdrop-blur-md sticky top-0 z-10">
      <div className="font-bold text-lg tracking-tight text-primary/80 hidden md:block">
        {/* Breadcrumbs or Page Title could go here */}
        Dashboard
      </div>

      <div className="flex justify-end gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
              }
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
