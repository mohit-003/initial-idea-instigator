
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        
        <div className="container mx-auto py-8 px-4">
          <Alert className="mb-8 border-green-500/50 bg-green-500/10">
            <Info className="h-4 w-4 text-green-500" />
            <AlertTitle>New Web App Available</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <span>Track your steps and earn farm coins with our Progressive Web App!</span>
              <PwaInstallButton variant="outline" size="sm" className="mt-2 sm:mt-0" />
            </AlertDescription>
          </Alert>
          
          <FeaturesSection />
          
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start your fitness journey?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/login">Get Started</Link>
              </Button>
              <PwaInstallButton size="lg" variant="outline" />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-8 px-4 bg-muted/40">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Harvest Steps. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
