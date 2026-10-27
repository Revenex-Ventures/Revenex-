import { Component, type ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-[#F5F0E8]">
        <BrandLogo size="lg" stacked />
        <h1 className="text-2xl font-bold text-[#17375D]">
          Unable to load this page
        </h1>
        <p className="text-[#6B5D52]">
          Please check your connection and reload the page.
        </p>
        <button
          className="rounded-xl bg-[#17375D] px-6 py-3 font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </main>
    );
  }
}
