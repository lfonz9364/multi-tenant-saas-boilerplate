"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const onboardUser = async () => {
        try {
          const res = await fetch("api/onboard", {
            method: "POST",
            body: JSON.stringify({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName,
            }),
          });
          const data: { tenantSlug: string } = await res.json();
          if (data.tenantSlug) {
            router.push(`/dashboard/${data.tenantSlug}`);
          }
        } catch (error) {
          throw new Error("Error onboarding user: " + (error as Error).message);
        }
      };

      onboardUser();
    }
  }, [isLoaded, router, user]);

  return (
    <div className="p-8 w-full max-w-2xl mx-auto fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
