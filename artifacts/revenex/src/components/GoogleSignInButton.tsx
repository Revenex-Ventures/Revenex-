import { useHindiText as useSiteText } from "@/lib/hindi-text";
import { useState, useRef, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLanguage } from "@/lib/language-context";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";
interface Props {
  onSuccess: (credential: string) => Promise<void>;
  onError: (message: string) => void;
  mode?: "signin" | "signup";
}
export default function GoogleSignInButton({
  onSuccess,
  onError,
  mode = "signin",
}: Props) {
  const siteText = useSiteText();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(220);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(280, Math.floor(entry.contentRect.width))),
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  if (!clientId)
    return (
      <p className="text-center text-sm text-[#6B5D52] py-3">{siteText("Google sign-in is currently unavailable. Please continue with email.")}</p>
    );
  return (
    <div
      ref={container}
      className="flex w-full min-h-11 flex-col items-center justify-center gap-2"
      aria-busy={loading}
    >
      <GoogleOAuthProvider clientId={clientId} locale={language} key={language}>
        <div className={loading ? "pointer-events-none opacity-60" : ""}>
          <GoogleLogin
            text={mode === "signup" ? "signup_with" : "signin_with"}
            shape="pill"
            size="large"
            theme="outline"
            width={width}
            onSuccess={async (response) => {
              if (!response.credential) {
                onError("Google sign-in did not complete. Please try again.");
                return;
              }
              setLoading(true);
              try {
                await onSuccess(response.credential);
              } catch (error) {
                onError(
                  error instanceof Error
                    ? error.message
                    : "Google sign-in failed. Please try again.",
                );
              } finally {
                setLoading(false);
              }
            }}
            onError={() =>
              onError(
                "Google sign-in did not complete. Please try again or continue with email.",
              )
            }
          />
        </div>
      </GoogleOAuthProvider>
      {loading && (
        <span role="status" className="text-xs text-[#6B5D52]">{siteText("Verifying your account…")}</span>
      )}
    </div>
  );
}
