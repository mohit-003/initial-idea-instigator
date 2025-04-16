
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Leaf, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}`);
      heroRef.current.style.setProperty('--mouse-y', `${y}`);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 md:py-40 hero-gradient overflow-hidden"
      style={{
        '--mouse-x': '0.5',
        '--mouse-y': '0.5',
      } as React.CSSProperties}
    >
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-radial from-primary/30 to-transparent"
        style={{
          backgroundPosition: 'calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%)',
          transition: 'background-position 0.2s ease-out',
        }}
      />
      
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      
      {/* Hero content */}
      <div className="max-w-5xl mx-auto text-center relative z-10 page-transition">
        <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-border bg-background/80 backdrop-blur-sm">
          <span className="mr-2 text-xs font-medium text-primary">New</span>
          <span className="text-xs">Turn your steps into virtual crops</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-float">
          Grow Your Virtual Farm With Real-World Steps
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-12">
          Connect your fitness data and watch as your physical activity transforms into a thriving farm in your pocket.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login?signup=true">
            <Button size="lg" className="button-transition hover-lift px-8 py-6 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="button-transition hover-lift px-8 py-6 text-lg">
              View Demo
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24 px-4">
        {[
          {
            icon: <Activity className="h-8 w-8 text-primary" />,
            title: "Track Fitness",
            description: "Connect your fitness tracker or smartphone to sync your daily activity."
          },
          {
            icon: <Leaf className="h-8 w-8 text-leaf" />,
            title: "Grow Crops",
            description: "Your steps and activity transform into growth for your virtual farm."
          },
          {
            icon: <Smartphone className="h-8 w-8 text-secondary" />,
            title: "Sync Anywhere",
            description: "Seamlessly connect with popular fitness apps and wearable devices."
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="glass-card rounded-xl p-6 hover-lift backdrop-blur-md"
          >
            <div className="mb-4 bg-background/70 p-3 rounded-full w-fit">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-foreground/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
