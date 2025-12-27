import { useState, useEffect } from "react";
import { X, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SESSION_STORAGE_KEY = "pwa-banner-dismissed";

export function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      return;
    }

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // iOS doesn't support beforeinstallprompt, show banner with manual instructions
      setIsVisible(true);
    } else {
      // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed top-2 left-4 right-4 z-50 bg-card border rounded-lg p-2 shadow-lg animate-in slide-in-from-top duration-300"
      style={{ marginTop: "env(safe-area-inset-top)" }}
      data-testid="banner-pwa-install"
    >
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        <img 
          src="/apple-touch-icon.png" 
          alt="ask.coty app icon" 
          className="w-8 h-8 rounded-lg flex-shrink-0"
          data-testid="img-pwa-icon"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" data-testid="text-pwa-title">
            Add to Home Screen
          </p>
          {isIOS ? (
            <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-pwa-instructions">
              Tap <Share className="inline-block w-3 h-3 mx-0.5" /> then "Add to Home Screen" <Plus className="inline-block w-3 h-3 mx-0.5" />
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-pwa-instructions">
              Install for quick access and a better experience
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && deferredPrompt && (
            <Button 
              size="sm" 
              onClick={handleInstall}
              data-testid="button-pwa-install"
            >
              Install
            </Button>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleDismiss}
            data-testid="button-pwa-dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
