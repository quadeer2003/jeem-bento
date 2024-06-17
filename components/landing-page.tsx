"use client";

import { InteractiveGridPattern } from "@/components/ui/backgrounds/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Grid3x3,
  Layers,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import LandingNav from "@/components/landing-nav";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Navigation */}
      <LandingNav />

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 opacity-100",
          )}
          width={40}
          height={40}
          squares={[40, 40]}
          squaresClassName="stroke-gray-400/50 dark:stroke-gray-600/50"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 dark:from-purple-950/10 dark:via-transparent dark:to-blue-950/10" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Your Workspace, Reimagined
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                Organize Everything
              </span>
              <br />
              <span className="bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                In One Beautiful Bento
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              A customizable bento grid workspace that adapts to your workflow.
              Drag, drop, and design your perfect productivity environment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary/20 bg-background/50 backdrop-blur-sm font-semibold text-lg hover:bg-primary/5 transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-2 pt-8 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>No credit card required</span>
              <span className="text-muted-foreground/50">•</span>
              <span>Free forever plan</span>
            </div>
          </div>
        </section>

        {/* Visual Mockup Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl border border-border/50 bg-gradient-to-br from-purple-50/30 to-blue-50/30 dark:from-purple-950/10 dark:to-blue-950/10 p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Workspace, Your Way
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Create a personalized dashboard with customizable bento
                    boxes
                  </p>
                </div>

                {/* Mockup Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                  <div className="col-span-2 aspect-video rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 border border-purple-300/50 dark:border-purple-700/50 p-6 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-sm font-medium">Quick Notes</p>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 border border-blue-300/50 dark:border-blue-700/50 p-4 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-1">🔗</div>
                      <p className="text-xs font-medium">Links</p>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 border border-pink-300/50 dark:border-pink-700/50 p-4 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-1">⏰</div>
                      <p className="text-xs font-medium">Clock</p>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 border border-green-300/50 dark:border-green-700/50 p-4 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-1">☀️</div>
                      <p className="text-xs font-medium">Weather</p>
                    </div>
                  </div>

                  <div className="col-span-2 aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border border-orange-300/50 dark:border-orange-700/50 p-6 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm font-medium">Custom Widget</p>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 border border-indigo-300/50 dark:border-indigo-700/50 p-4 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-1">🎯</div>
                      <p className="text-xs font-medium">Tasks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 py-16 md:py-24"
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything You Need, Nothing You Don't
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built for productivity enthusiasts who love beautiful,
                functional design
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Grid3x3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bento Grid Layout</h3>
                <p className="text-muted-foreground">
                  Organize your workspace with a beautiful, responsive bento
                  grid that adapts to your needs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Drag & Drop</h3>
                <p className="text-muted-foreground">
                  Effortlessly rearrange your bentos with intuitive
                  drag-and-drop functionality.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built with Next.js and optimized for performance. Your
                  workspace loads instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section
          id="use-cases"
          className="container mx-auto px-4 py-16 md:py-24"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Made for the Way You Work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Use Case 1 */}
              <div className="relative p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">📝 Notes & Ideas</h3>
                <p className="text-muted-foreground mb-4">
                  Capture thoughts, create rich notes with our built-in editor,
                  and keep everything organized in customizable bentos.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Rich text editing with BlockNote
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Quick capture and search
                    </span>
                  </li>
                </ul>
              </div>

              {/* Use Case 2 */}
              <div className="relative p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-pink-950/20 dark:to-orange-950/20 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">🔗 Quick Links</h3>
                <p className="text-muted-foreground mb-4">
                  Keep your most important links at your fingertips. Access them
                  instantly from your personalized workspace.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Custom backgrounds for visual organization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      One-click access to your tools
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 md:p-16 rounded-3xl border border-border/50 bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/30 dark:to-blue-950/30 backdrop-blur-sm overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your Workspace?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have already organized their
                  digital life with Jeem Bento.
                </p>
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Start Building Your Bento
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Jeem Bento. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
