import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { EnvVarWarning } from "@/components/env-var-warning";

// Import BlockNote styles globally
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Jeem Bento - Workspace",
  description: "Organize your workspace with a customizable bento grid.",
};

const inter = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {!hasEnvVars && <EnvVarWarning />}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
