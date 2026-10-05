import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const Preloader: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-gradient-navy flex flex-col justify-center items-center z-50">
      <div className="relative mb-8">
        <Camera size={60} className="text-gold-500" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-ping" />
      </div>
      
      <h1 className="text-3xl font-bold text-white font-playfair mb-8">
        FotoBudka
      </h1>
      
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gold-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      <p className="text-white/80 text-sm">
        {loadingProgress.toFixed(0)}% Ładowanie...
      </p>
    </div>
  );
};

export default Preloader;