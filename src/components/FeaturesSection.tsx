
import { useRef, useEffect } from 'react';
import { 
  Smartphone, 
  BarChart2, 
  Calendar, 
  Award, 
  Users, 
  Leaf 
} from 'lucide-react';

const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!featuresRef.current) return;
      
      const elements = featuresRef.current.querySelectorAll('.feature-card');
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Device Sync",
      description: "Synchronize with any fitness tracker or smartphone to track your daily activity."
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Visual Progress",
      description: "Watch beautiful visualizations of your fitness data transform into farm growth."
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Daily Challenges",
      description: "Complete daily movement goals to unlock special crops and farm enhancements."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Crop Variety",
      description: "Discover and grow different crops based on your activity types and intensity."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Social Farming",
      description: "Connect with friends to compare farms and motivate each other to stay active."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Achievements",
      description: "Earn badges and trophies as you reach fitness milestones and grow your farm."
    }
  ];

  return (
    <div ref={featuresRef} className="py-24 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Gamify Your Fitness Journey</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Turn your daily physical activity into an engaging farming experience with features designed to keep you motivated.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 rounded-xl bg-white border border-border shadow-sm hover:shadow-md hover-lift"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
