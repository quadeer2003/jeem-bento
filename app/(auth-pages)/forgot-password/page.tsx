import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Home
      </Link>

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 flex items-center justify-center">
            <span className="text-white text-xl">🍱</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <form className="flex flex-col gap-4 w-full">
          <div>
            <Label htmlFor="email" className="text-sm font-medium mb-2 block">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="rounded-lg px-4 py-3 bg-background border border-input w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <SubmitButton
            formAction={forgotPasswordAction}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white rounded-lg px-4 py-3 font-semibold transition-all hover:scale-105"
          >
            Send Reset Link
          </SubmitButton>

          <FormMessage message={searchParams} />

          <div className="flex items-center justify-center gap-2 text-sm pt-2">
            <span className="text-muted-foreground">
              Remember your password?
            </span>
            <Link
              href="/sign-in"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>

      <SmtpMessage />
    </div>
  );
}
