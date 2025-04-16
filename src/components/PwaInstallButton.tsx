
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Define the props for the component with proper typing
type PwaInstallButtonProps = {
  className?: string;
} & Pick<VariantProps<typeof buttonVariants>, 'variant' | 'size'>;

const PwaInstallButton = ({ 
  className = '', 
  variant = 'default', 
  size = 'default' 
}: PwaInstallButtonProps) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Log app installed event
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // User accepted: clear the prompt since it can't be used again
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleHelpClick = () => {
    // If we can't provide the install prompt, show instructions based on browser
    const userAgent = navigator.userAgent.toLowerCase();
    let instructionsUrl = "https://web.dev/i18n/en/progressive-web-apps/";
    
    // Detect browser and provide specific installation instructions
    if (/chrome/.test(userAgent)) {
      instructionsUrl = "https://support.google.com/chrome/answer/9658361";
    } else if (/firefox/.test(userAgent)) {
      instructionsUrl = "https://support.mozilla.org/en-US/kb/progressive-web-apps-firefox-android";
    } else if (/safari/.test(userAgent)) {
      instructionsUrl = "https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios";
    } else if (/edge/.test(userAgent)) {
      instructionsUrl = "https://support.microsoft.com/en-us/microsoft-edge/add-a-website-to-apps-in-microsoft-edge-f1ffab6a-6cc3-405f-bd07-7a60f37adda5";
    }
    
    window.open(instructionsUrl, "_blank");
  };

  if (isInstalled) {
    return null; // Don't show button if app is already installed
  }

  return isInstallable ? (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleInstallClick}
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`gap-2 ${className}`}
            onClick={handleHelpClick}
          >
            <ExternalLink className="h-4 w-4" />
            <span>Install Instructions</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Learn how to install this app on your device</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PwaInstallButton;
