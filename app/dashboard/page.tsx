"use client";

import ClientRedirect from "@/components/ui/ClientRedirect";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const MainDashboard = () => {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: {
        width: "8rem",
        height: "8rem",
      },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <span className="mb-8 flex flex-col items-center justify-between">
          <UserButton appearance={userButtonAppearance} />
          <p className="mt-4">Welcome to the SaaS starter ✨</p>
          <ClientRedirect />
        </span>
      </SignedIn>
    </div>
  );
};

export default MainDashboard;
