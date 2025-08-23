import React from 'react';
import airplaneImg from "../assets/Airplane--.png"; 

const TravelIllustration: React.FC = () => {
  return (
    <div className="absolute right-40 top-1/2 transform -translate-y-1/2 
                    w-[40%] max-w-lg flex items-center justify-center">
      <img 
        src={airplaneImg}
        alt="Travel Airplane"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default TravelIllustration;
