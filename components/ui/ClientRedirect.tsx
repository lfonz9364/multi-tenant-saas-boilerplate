'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ClientRedirect = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const onboard = async () => {
      if (!user || !isLoaded) {
        return;
      }

      try {
        const res = await fetch("api/onboard", {
          method: "POST",
          body: JSON.stringify({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        const data: { tenantSlug: string } = await res.json();
        if (data.tenantSlug) {
          router.push(`/dashboard/${data.tenantSlug}`);
        }
      } catch (err) {
        throw new Error("Error onboarding user: " + (err as Error).message);
      }
    };

    onboard();
  }, [user, isLoaded, router]);

  return <p>Redirecting to your dashboard...</p>;
};

export default ClientRedirect;
