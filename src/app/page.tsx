import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import DashboardPage from "./dashboard/page";

export default function Home() {
  return (
    <main className="p-10">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <p>Welcome to the SaaS starter ✨</p>
      </SignedIn>
      <DashboardPage />
    </main>
  );
}
