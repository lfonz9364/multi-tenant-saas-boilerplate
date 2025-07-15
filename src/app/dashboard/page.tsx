"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: {
        width: "8rem",
        height: "8rem",
      },
    },
  };

  useEffect(() => {
    if (isLoaded && user) {
      const onboardUser = async () => {
        try {
          // const res = await fetch("api/onboard", {
          //   method: "POST",
          //   body: JSON.stringify({
          //     clerkUserId: user.id,
          //     email: user.primaryEmailAddress?.emailAddress,
          //     name: user.fullName,
          //   }),
          // });
          // const data: { tenantSlug: string } = await res.json();
          // if (data.tenantSlug) {
          //   router.push(`/dashboard/${data.tenantSlug}`);
          // }
        } catch (error) {
          throw new Error("Error onboarding user: " + (error as Error).message);
        }
      };

      onboardUser();
    }
  }, [isLoaded, router, user]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <span className="mb-8 flex flex-col items-center justify-between">
          <UserButton appearance={userButtonAppearance} />
          <p className="mt-4">Welcome to the SaaS starter ✨</p>
        </span>
      </SignedIn>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
