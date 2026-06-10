import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";
import { ClerkNotConfigured } from "@/components/clerk-not-configured";

export default function SignUpPage() {
  if (!isClerkConfigured()) return <ClerkNotConfigured />;
  return <SignUp fallbackRedirectUrl="/admin" />;
}
