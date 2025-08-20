import React from 'react';

const TravelIllustration: React.FC = () => {
  return (
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full flex items-center justify-center">
      <img 
        src="/src/assets/Airplane--.png" 
        alt="Travel Airplane" 
        className="w-96 h-auto object-contain"
      />
    </div>
  );
};

export default TravelIllustration;
