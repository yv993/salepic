import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";
import { ClerkNotConfigured } from "@/components/clerk-not-configured";

export default function SignInPage() {
  if (!isClerkConfigured()) return <ClerkNotConfigured />;
  return <SignIn fallbackRedirectUrl="/admin" />;
}
