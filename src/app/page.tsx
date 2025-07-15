import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: {
        width: "8rem",
        height: "8rem",
      },
    },
  };

  return (
    <main className="p-10 fixed inset-0 flex flex-col items-center justify-center">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <span className="mb-8 flex flex-col items-center justify-between">
          <UserButton appearance={userButtonAppearance} />
          <p className="mt-4">Welcome to the SaaS starter ✨</p>
        </span>
      </SignedIn>
      <DashboardPage />
    </main>
  );
}
